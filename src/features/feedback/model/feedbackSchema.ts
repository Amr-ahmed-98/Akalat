import { z } from "zod";

export const FEEDBACK_TYPES = [
  "suggestion",
  "bug",
  "complaint",
  "question",
  "other",
] as const;

export const IMPORTANCE_LEVELS = ["normal", "urgent"] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];
export type ImportanceLevel = (typeof IMPORTANCE_LEVELS)[number];

export const feedbackSchema = z.object({
  type: z.enum(FEEDBACK_TYPES, {
    error: "errors.typeRequired",
  }),
  importance: z.enum(IMPORTANCE_LEVELS, {
    error: "errors.importanceRequired",
  }),
  details: z
    .string()
    .min(10, { message: "errors.detailsMin" })
    .max(1000, { message: "errors.detailsMax" }),
  screenshot: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "errors.fileSizeMax",
    })
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      { message: "errors.fileTypeInvalid" }
    )
    .optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
