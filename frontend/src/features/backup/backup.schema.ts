import { z } from "zod";

const projectSchema = z.object({
  id: z.uuid("id do projeto inválido"),
  name: z.string().min(1, "nome do projeto não pode ser vazio"),
  color: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional().nullable(),
});

const tagSchema = z.object({
  id: z.uuid("id da tag inválido"),
  name: z.string().min(1, "nome da tag não pode ser vazio"),
  projectId: z.uuid("projectId da tag inválido"),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional().nullable(),
});

const sessionSchema = z.object({
  id: z.uuid("id da sessão inválido"),
  focus: z.number(),
  name: z.string().min(1, "nome da sessão não pode ser vazio"),
  ratio: z.number().optional(),
  rest: z.number().optional(),
  projectId: z.uuid("projectId da sessão inválido").optional().nullable(),
  tagId: z.uuid("tagId da sessão inválido").optional().nullable(),
  date: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional().nullable(),
});

export const backupSchema = z.object({
  userId: z.uuid("id do é obrigatório"),
  version: z.number().default(1),
  exportedAt: z.string().default(() => new Date().toISOString()),
  projects: z.array(projectSchema),
  tags: z.array(tagSchema),
  sessions: z.array(sessionSchema),
});

export type BackupData = z.infer<typeof backupSchema>;
