import { z } from "zod";

const projectSchema = z.object({
  id: z.uuid("id do projeto inválido"),
  name: z.string().min(1, "nome do projeto não pode ser vazio"),
});

const tagSchema = z.object({
  id: z.uuid("id da tag inválido"),
  name: z.string().min(1, "nome da tag não pode ser vazio"),
  projectId: z.uuid("projectId da tag inválido"),
});

const sessionSchema = z.object({
  id: z.uuid("id da sessão inválido"),
  focus: z.number(),
  name: z.string().min(1, "nome da sessão não pode ser vazio"),
  ratio: z.number().optional(),
  rest: z.number().optional(),
  projectId: z.uuid("projectId da sessão inválido").optional(),
  tagId: z.uuid("tagId da sessão inválido").optional(),
  date: z.string().optional(),
});

export const backupSchema = z.object({
  version: z.number().default(1),
  exportedAt: z.string().default(() => new Date().toISOString()),
  projects: z.array(projectSchema),
  tags: z.array(tagSchema),
  sessions: z.array(sessionSchema),
});

export type BackupData = z.infer<typeof backupSchema>;
