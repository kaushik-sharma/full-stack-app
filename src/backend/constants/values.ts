import { DateTime, Duration } from "luxon";
import { ReportTargetType } from "@prisma/client";

import { AwsS3FileCategory } from "../services/aws_s3_service.js";
import { Env } from "./enums.js";

export class Constants {
  static env: Env;

  // Auth Tokens
  static readonly authTokenExpiryDurationInSec = Duration.fromObject({
    days: 30,
  }).as("seconds");
  static readonly emailCodeExpiryDurationInSec = Duration.fromObject({
    minutes: 10,
  }).as("seconds");
  static readonly sessionCacheExpiryDurationInSec = Duration.fromObject({
    days: 7,
  }).as("seconds");

  // Images
  static readonly imageExpiryDuration = Duration.fromObject({ hours: 48 });

  // Users
  static readonly minDobDate = DateTime.utc(1901, 1, 1);
  static readonly minAccountOpeningAge = 18;
  static readonly defaultProfileImagePath = `${AwsS3FileCategory.static}/default_profile_image.png`;
  static get userDeletionGracePeriodDuration(): Duration {
    return this.env === Env.PRODUCTION
      ? Duration.fromObject({ days: 30 })
      : Duration.fromObject({ minutes: 5 });
  }

  // Posts
  static readonly maxCommentLevel = 5;
  static readonly postsPageSize = 20;
  static readonly commentsPageSize = 30;

  // Content Moderation
  static readonly #devModerationThreshold = {
    [ReportTargetType.POST]: 10,
    [ReportTargetType.COMMENT]: 10,
    [ReportTargetType.USER]: 10,
  };
  static readonly #prodModerationThreshold = {
    [ReportTargetType.POST]: 2000,
    [ReportTargetType.COMMENT]: 1000,
    [ReportTargetType.USER]: 1000,
  };
  static readonly contentModerationThreshold = (
    targetType: ReportTargetType
  ): number => {
    return this.env === Env.PRODUCTION
      ? this.#prodModerationThreshold[targetType]
      : this.#devModerationThreshold[targetType];
  };

  // Rate Limiter
  static readonly defaultRateLimiterWindowMs = Duration.fromObject({
    minutes: 5,
  }).as("milliseconds");
  static readonly defaultRateLimiterMax = 100;
  static readonly moderationRateLimiterWindowMs = Duration.fromObject({
    hours: 24,
  }).as("milliseconds");
  static readonly moderationRateLimiterMax = 100;
  static readonly requestEmailCodeRateLimiterWindowMs = Duration.fromObject({
    hours: 1,
  }).as("milliseconds");
  static readonly requestEmailCodeRateLimiterMax = 5;

  // Files
  static readonly maxImageFileSizeInBytes = 3145728; // 3 MB
  static readonly allowedImageMimetypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  static readonly devEmailVerificationWhitelist = ["gmail.com"];
}
