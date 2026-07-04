export interface SessionModel {
  id: string;
  name: string;
  focus: number;
  ratio: number;
  rest: number;
  projectId: number | null;
  tagId: number | null;
  date: string;
}
