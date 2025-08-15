import * as z from "zod"

export interface ActionResponse < T = z.infer<typeof formSchema> > {
  success: boolean
  message: string
  errors ? : {
    [K in keyof T] ? : string[]
  }
  inputs ? : T
}
export const formSchema = z.object({
  submissionId: z.string().optional().nullable(),
  name: z.string().min(1).max(50,{
    message: "Title should be between 3 and 50 characters"
  }),
  description: z.string().min(1).max(250,{
    message: "Description should be between 3 and 250 characters"
  }),
  mainDescription: z.string().max(10000,{
    message: "Description should be between 3 and 10000 characters"
  }).optional(),
  github: z.url({
    hostname: /^github\.com$/,
     message: "Must be a valid Github link"
  }).or(z.literal("")),
  youtube: z.string().trim().refine(
    val => val === '' || /^https?:\/\/(www\.)?youtube\.com/.test(val), {
    message: 'Must be a YouTube link',
  }).optional(),
  photos: z.string(),
  status: z.string().optional()
}); 