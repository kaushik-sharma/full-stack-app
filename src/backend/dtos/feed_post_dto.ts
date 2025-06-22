import { EntityStatus } from "@prisma/client";

export interface CreatorParams {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export interface FeedPostParams {
  id: string | null;
  text: string | null;
  imageUrl: string | null;
  likeCount: number | null;
  dislikeCount: number | null;
  commentCount: number | null;
  createdAt: Date | null;
  repostedPost: FeedPostParams | null;
  creator: CreatorParams | null;
  status: EntityStatus;
}

export class FeedPostDto {
  constructor(params: FeedPostParams) {
    Object.assign(this, params);
  }
}
