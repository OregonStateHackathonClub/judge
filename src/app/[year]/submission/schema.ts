import * as z from "zod"

export interface ActionResponse < T = any > {
  success: boolean
  message: string
  errors ? : {
    [K in keyof T] ? : string[]
  }
  inputs ? : T
}
export const formSchema = z.object({
  name: z.string().min(1).max(50,{
    message: "Title should be between 3 and 50 characters"
  }),
  description: z.string().min(1).max(250,{
    message: "Description should be between 3 and 250 characters"
  }),
  mainDescription: z.string().min(1).max(10000,{
    message: "Description should be between 3 and 10000 characters"
  }),
  github: z.url({
     hostname: /^github\.com$/,
     message: "Must be a github link"
  }),
  youtube: z.string().trim().refine(
    val => val === '' || /^https?:\/\/(www\.)?youtube\.com/.test(val), {
    message: 'Must be a YouTube link',
  }).optional(),
  photos: z.string(),
  status: z.string().optional()
}); 