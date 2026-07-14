export interface CreateSessionDTO {
  id: string;
  focus: number;
  name: string;
  ratio?: number;
  rest?: number;
  projectId?: string;
  tagId?: string;
}

export interface UpdateSessionDTO {
  focus: number;
  name: string;
  ratio?: number;
  rest?: number;
  projectId?: string;
  tagId?: string;
}
