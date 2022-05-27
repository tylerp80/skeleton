import { z } from "zod";

export const inputSchemaGratitudeCreate = z.object({
  description: z.string().min(1).max(500),
});

export const inputSchemaGratitudeList = z.object({
  cursor: z.string().nullish(),
});

export const inputSchemaGratitudeUpdate = z.object({
  id: z.string(),
  description: z.string().min(1).max(500),
});

export const inputSchemaGratitudeDelete = z.object({
  id: z.string(),
});
