import { z } from "zod";


export const createDebateSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be less than 2000 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required").max(5, "Maximum 5 tags allowed"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
  duration: z.number().min(60, "Minimum duration is 1 hour").max(10080, "Maximum duration is 1 week"),
})

export const createArgumentSchema = z.object({
  content: z
    .string()
    .min(20, "Argument must be at least 20 characters")
    .max(1000, "Argument must be less than 1000 characters"),
  side: z.enum(["SUPPORT", "OPPOSE"]),
})

export const joinDebateSchema = z.object({
  side: z.enum(["SUPPORT", "OPPOSE"]),
})

export type CreateDebateInput = z.infer<typeof createDebateSchema>
export type CreateArgumentInput = z.infer<typeof createArgumentSchema>
export type JoinDebateInput = z.infer<typeof joinDebateSchema>