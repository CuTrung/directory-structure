import { ZodIssue } from 'zod';
export type ResponseZodError = { path: string; message: string } | ZodIssue;
