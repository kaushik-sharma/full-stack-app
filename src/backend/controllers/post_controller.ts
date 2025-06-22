import { RequestHandler } from "express";
import { arrayToTree } from "performant-array-to-tree";

import { validateData } from "../helpers/validation_helper.js";
import {
  createCommentSchema,
  CreateCommentType,
  createPostSchema,
  CreatePostType,
  createReactionSchema,
  CreateReactionType,
} from "../validation/post_schema.js";
import { asyncHandler } from "../helpers/async_handler.js";
import { PostDatasource } from "../datasources/post_datasource.js";
import { CustomError } from "../middlewares/error_middlewares.js";
import { AwsS3Service, AwsS3FileCategory } from "../services/aws_s3_service.js";
import { SocketManager } from "../socket.js";
import { successResponseHandler } from "../helpers/success_handler.js";
import { Constants } from "../constants/values.js";
import { FeedPostDto, FeedPostParams } from "../dtos/feed_post_dto.js";
import { FeedCommentDto } from "../dtos/feed_comment_dto.js";
import {
  Prisma,
  EntityStatus,
  Post,
  Comment,
  User,
} from "@prisma/client";
import { UserPostDto } from "../dtos/user_post_dto.js";
import { UserCommentDto } from "../dtos/user_comment_dto.js";
// import { KafkaService } from "../services/kafka_service.js";

type Creator = Pick<
  User,
  "id" | "firstName" | "lastName" | "profileImagePath" | "status"
>;

export type FeedPost = Pick<
  Post,
  "id" | "text" | "imagePath" | "status" | "createdAt"
> & {
  user: Creator;
  repostedPost: FeedPost | null;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
};

export type FeedComment = Comment & {
  user: Creator;
};

export class PostController {
  static readonly validateCreatePostRequest: RequestHandler = (
    req,
    res,
    next
  ) => {
    req.parsedData = validateData(createPostSchema, req.body);
    next();
  };

  static readonly createPost: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const userId = req.user!.userId;

      const parsedData = req.parsedData! as CreatePostType;

      if (parsedData.repostedPostId !== undefined) {
        const postExists: boolean = await PostDatasource.postExists(
          parsedData.repostedPostId
        );
        if (!postExists) {
          throw new CustomError(404, "Reposted post not found!");
        }
      }

      let imagePath: string | null = null;
      let imageUrl: string | null = null;
      const imageFile = req.file as Express.Multer.File | undefined;
      if (imageFile !== undefined) {
        imagePath = await AwsS3Service.uploadFile(
          imageFile,
          AwsS3FileCategory.posts
        );
        imageUrl = AwsS3Service.getCloudFrontSignedUrl(imagePath);
      }

      const postData: Prisma.PostCreateInput = {
        user: { connect: { id: userId } },
        text: parsedData.text,
        imagePath: imagePath,
        repostedPost: parsedData.repostedPostId
          ? { connect: { id: parsedData.repostedPostId } }
          : undefined,
        status: EntityStatus.ACTIVE,
      };
      const postId = await PostDatasource.createPost(postData);

      const createdPost = await PostDatasource.getPostById(postId);
      const feedPostDto = this.#processFeedPosts([createdPost])[0];

      SocketManager.io.emit("newPostsAvailable", {
        message: "New posts added. Refresh the feed.",
      });

      successResponseHandler({
        res: res,
        status: 200,
        data: feedPostDto,
      });
    }
  );

  static readonly validateCreateReactionRequest: RequestHandler = (
    req,
    res,
    next
  ) => {
    req.parsedData = validateData(createReactionSchema, req.body);
    next();
  };

  static readonly createReaction: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const userId = req.user!.userId;

      const parsedData = {
        ...(req.parsedData! as CreateReactionType),
        userId: userId,
        postId: req.params.postId,
      };

      const postExists = await PostDatasource.postExists(parsedData.postId);
      if (!postExists) {
        throw new CustomError(404, "Post not found!");
      }

      const reactionData: Prisma.ReactionCreateInput = {
        user: { connect: { id: userId } },
        post: { connect: { id: parsedData.postId } },
        emotionType: parsedData.emotionType,
      };
      await PostDatasource.createReaction(reactionData);

      // await KafkaService.producer.send({
      //   topic: "post-reactions",
      //   messages: [
      //     {
      //       key: `${parsedData.postId}:${userId}`,
      //       value: JSON.stringify(reactionData),
      //     },
      //   ],
      // });

      successResponseHandler({
        res: res,
        status: 200,
      });
    }
  );

  static readonly validateCreateCommentRequest: RequestHandler = (
    req,
    res,
    next
  ) => {
    req.parsedData = validateData(createCommentSchema, req.body);
    next();
  };

  static readonly createComment: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const userId = req.user!.userId;

      const parsedData = {
        ...(req.parsedData! as CreateCommentType),
        userId: userId,
        postId: req.params.postId,
      };

      if (parsedData.level === 0 && parsedData.parentCommentId) {
        throw new CustomError(400, "parentCommentId must be null if level = 0");
      }
      if (parsedData.level > 0 && !parsedData.parentCommentId) {
        throw new CustomError(400, "parentCommentId required if level > 0");
      }

      const postExists = await PostDatasource.postExists(parsedData.postId);
      if (!postExists) {
        throw new CustomError(404, "Post not found!");
      }

      if (parsedData.level > 0) {
        const parentCommentExists = await PostDatasource.commentExists(
          parsedData.parentCommentId!,
          parsedData.level - 1,
          parsedData.postId
        );
        if (!parentCommentExists) {
          throw new CustomError(404, "Parent comment not found!");
        }
      }

      const commentData: Prisma.CommentCreateInput = {
        post: { connect: { id: parsedData.postId } },
        user: { connect: { id: parsedData.userId } },
        parentCommentId: parsedData.parentCommentId,
        level: parsedData.level,
        text: parsedData.text,
        status: EntityStatus.ACTIVE,
      };

      const commentId = await PostDatasource.createComment(commentData);

      const createdCommentData = await PostDatasource.getCommentById(commentId);

      const profileImageUrl = AwsS3Service.getCloudFrontSignedUrl(
        createdCommentData.user!.profileImagePath ??
          Constants.defaultProfileImagePath
      );

      const commentDto = new FeedCommentDto({
        id: createdCommentData.id!,
        parentCommentId: createdCommentData.parentCommentId,
        text: createdCommentData.text,
        createdAt: createdCommentData.createdAt!,
        creator: {
          id: createdCommentData.user!.id!,
          firstName: createdCommentData.user!.firstName!,
          lastName: createdCommentData.user!.lastName!,
          profileImageUrl: profileImageUrl,
        },
        status: createdCommentData.status,
      });

      successResponseHandler({
        res: res,
        status: 200,
        data: commentDto,
      });
    }
  );

  static readonly getCommentsByPostId: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const getEffectiveStatus = (
        commentStatus: EntityStatus,
        userStatus: EntityStatus
      ): EntityStatus => {
        return userStatus !== EntityStatus.ACTIVE
          ? EntityStatus.DELETED
          : commentStatus;
      };

      const postId = req.params.postId as string | undefined | null;
      if (postId === undefined || postId === null) {
        throw new CustomError(400, "Post ID is required.");
      }

      const postExists: boolean = await PostDatasource.postExists(postId);
      if (!postExists) {
        throw new CustomError(404, "Post not found!");
      }

      const commentsData = await PostDatasource.getCommentsByPostId(postId);

      const commentDtos = commentsData.map((comment) => {
        const status = getEffectiveStatus(comment.status, comment.user!.status);
        const isActive = status === EntityStatus.ACTIVE;

        const profileImageUrl = isActive
          ? AwsS3Service.getCloudFrontSignedUrl(
              comment.user!.profileImagePath ??
                Constants.defaultProfileImagePath
            )
          : null;

        return new FeedCommentDto({
          id: comment.id!,
          parentCommentId: comment.parentCommentId,
          text: isActive ? comment.text : null,
          createdAt: isActive ? comment.createdAt! : null,
          creator: isActive
            ? {
                id: comment.user!.id!,
                firstName: comment.user!.firstName!,
                lastName: comment.user!.lastName!,
                profileImageUrl: profileImageUrl!,
              }
            : null,
          status: status,
        });
      });

      const commentsTree = arrayToTree(commentDtos, {
        id: "id",
        parentId: "parentCommentId",
        childrenField: "replies",
        nestedIds: false,
        dataField: null,
      });

      successResponseHandler({
        res: res,
        status: 200,
        data: commentsTree,
      });
    }
  );

  static readonly #processFeedPosts = (posts: FeedPost[]): FeedPostDto[] => {
    return posts.map((post) => {
      const postImageUrl =
        post.imagePath != null
          ? AwsS3Service.getCloudFrontSignedUrl(post.imagePath)
          : null;
      const profileImageUrl = AwsS3Service.getCloudFrontSignedUrl(
        post.user!.profileImagePath ?? Constants.defaultProfileImagePath
      );

      let repostedPost: FeedPostParams | null = null;
      if (post.repostedPost !== null) {
        const repostImageUrl =
          post.repostedPost?.imagePath != null
            ? AwsS3Service.getCloudFrontSignedUrl(post.repostedPost.imagePath)
            : null;
        const repostProfileImageUrl =
          post.repostedPost !== null
            ? AwsS3Service.getCloudFrontSignedUrl(
                post.repostedPost!.user!.profileImagePath ??
                  Constants.defaultProfileImagePath
              )
            : null;
        repostedPost = {
          id: post.repostedPost?.id ?? null,
          text: post.repostedPost?.text ?? null,
          imageUrl: repostImageUrl,
          likeCount: post.repostedPost?.likeCount ?? null,
          dislikeCount: post.repostedPost?.dislikeCount ?? null,
          commentCount: post.repostedPost?.commentCount ?? null,
          createdAt: post.repostedPost?.createdAt ?? null,
          repostedPost: null,
          creator:
            post.repostedPost !== null
              ? {
                  id: post.repostedPost!.user!.id!,
                  firstName: post.repostedPost!.user!.firstName!,
                  lastName: post.repostedPost!.user!.lastName!,
                  profileImageUrl: repostProfileImageUrl!,
                }
              : null,
          status: post.repostedPost?.status ?? EntityStatus.DELETED,
        };
      }

      return new FeedPostDto({
        id: post.id!,
        text: post.text,
        imageUrl: postImageUrl,
        likeCount: post.likeCount!,
        dislikeCount: post.dislikeCount!,
        commentCount: post.commentCount!,
        createdAt: post.createdAt!,
        repostedPost: repostedPost,
        creator: {
          id: post.user!.id!,
          firstName: post.user!.firstName!,
          lastName: post.user!.lastName!,
          profileImageUrl: profileImageUrl,
        },
        status: post.status,
      });
    });
  };

  static readonly getPostsFeed: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const page = parseInt(req.query.page as string);
      if (page < 0) {
        throw new CustomError(400, "Page can not be less than zero!");
      }

      const posts = await PostDatasource.getPostsFeed(page);
      const feed = this.#processFeedPosts(posts);

      successResponseHandler({
        res: res,
        status: 200,
        data: feed,
      });
    }
  );

  static readonly getUserPosts: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const userId = req.user!.userId;

      const page = parseInt(req.query.page as string);
      if (page < 0) {
        throw new CustomError(400, "Page can not be less than zero!");
      }

      const posts = await PostDatasource.getPostsByUserId(userId, page);

      const postDtos = posts.map((post) => {
        const postImageUrl =
          post.imagePath != null
            ? AwsS3Service.getCloudFrontSignedUrl(post.imagePath)
            : null;

        return new UserPostDto({
          id: post.id!,
          text: post.text,
          imageUrl: postImageUrl,
          likeCount: post.likeCount!,
          dislikeCount: post.dislikeCount!,
          commentCount: post.commentCount!,
          createdAt: post.createdAt!,
        });
      });

      successResponseHandler({
        res: res,
        status: 200,
        data: postDtos,
      });
    }
  );

  static readonly getUserComments: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const userId = req.user!.userId;

      const page = parseInt(req.query.page as string);
      if (page < 0) {
        throw new CustomError(400, "Page can not be less than zero!");
      }

      const comments = await PostDatasource.getCommentsByUserId(userId, page);

      const commentDtos = comments.map(
        (comment) =>
          new UserCommentDto({
            id: comment.id!,
            postId: comment.postId,
            text: comment.text,
            createdAt: comment.createdAt!,
          })
      );

      successResponseHandler({
        res: res,
        status: 200,
        data: commentDtos,
      });
    }
  );

  static readonly deletePost: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const userId = req.user!.userId;

      const postId = req.params.postId;
      if (!postId) {
        throw new CustomError(400, "Post ID is required.");
      }

      const postUserId = await PostDatasource.getPostUserId(postId);
      if (!postUserId) {
        throw new CustomError(404, "Post not found!");
      }
      if (postUserId !== userId) {
        throw new CustomError(403, "Can not delete other users' posts!");
      }

      // Delete the post image if it exists from S3 & CloudFront
      const imagePath: string | null = await PostDatasource.getPostImagePath(
        postId
      );
      if (imagePath !== null) {
        AwsS3Service.initiateDeleteFile(imagePath);
      }

      await PostDatasource.deletePost(postId, userId);

      successResponseHandler({
        res: res,
        status: 200,
      });
    }
  );

  static readonly deleteComment: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const userId = req.user!.userId;

      const commentId = req.params.commentId;
      if (!commentId) {
        throw new CustomError(400, "Comment ID is required.");
      }

      const commentUserId = await PostDatasource.getCommentUserId(commentId);
      if (!commentUserId) {
        throw new CustomError(404, "Comment not found!");
      }
      if (commentUserId !== userId) {
        throw new CustomError(403, "Can not delete other users' comments!");
      }

      await PostDatasource.deleteComment(commentId, userId);

      successResponseHandler({
        res: res,
        status: 200,
      });
    }
  );
}
