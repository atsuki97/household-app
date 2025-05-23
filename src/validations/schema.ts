import { z } from "zod";

export const transactionSchema = z.object({
  type: z.string(),
  date: z.string().min(1, {message: "日付は必須です"}),
  amount: z.number().min(1, {message: "金額は1円以上必須です"}),
  content: z
    .string()
    .min(1, {message: "内容を入力してください"})
    .max(50, {message: "内容は50文字以内にしてください"}),

  category: z
    .union([
      z.string(),
      z.literal(""),
    ])
    .refine((val) => val !== "", {
      message: "カテゴリを選択してください",
    }),
});

export type Schema = z.infer<typeof transactionSchema>
