import { z } from "zod";

import { Constants } from "../constants/values.js";
import { EmotionType } from "@prisma/client";

export const createPostSchema = z.object({
  text: z
    .string({ required_error: "Text is required." })
    .trim()
    .nonempty({ message: "Text can not be empty." })
    .min(1)
    .max(500),
  repostedPostId: z
    .string()
    .trim()
    .nonempty({ message: "Reposted post ID can not be empty." })
    .uuid()
    .optional(),
});

export type CreatePostType = z.infer<typeof createPostSchema>;

export const createCommentSchema = z.object({
  text: z
    .string({ required_error: "Text is required." })
    .trim()
    .nonempty({ message: "Text can not be empty." })
    .min(1)
    .max(500),
  level: z
    .number({ required_error: "Level is required." })
    .min(0, { message: "Level must be equal to or greater than 0." })
    .max(Constants.maxCommentLevel - 1, {
      message: `Level must be less than ${Constants.maxCommentLevel}.`,
    }),
  parentCommentId: z
    .string({ required_error: "Parent comment ID is required." })
    .trim()
    .nonempty({ message: "Parent comment ID can not be empty." })
    .uuid()
    .nullable(),
});

export type CreateCommentType = z.infer<typeof createCommentSchema>;

export const createReactionSchema = z.object({
  emotionType: z.nativeEnum(EmotionType),
});

export type CreateReactionType = z.infer<typeof createReactionSchema>;
