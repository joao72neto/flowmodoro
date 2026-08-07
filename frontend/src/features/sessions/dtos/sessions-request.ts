export interface SessionPayloadDTO {
  id: string;
  focus: number;
  name: string;
  ratio?: number;
  rest?: number;
  projectId?: string;
  tagId?: string;
  date?: string;
}

export interface SessionUpdateDTO {
  focus?: number;
  name?: string;
  ratio?: number;
  rest?: number;
  projectId?: string;
  tagId?: string;
}
