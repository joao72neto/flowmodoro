export interface SessionDTO {
  id: string;
  name: string;
  focus: number;
  rest: number;
  ratio: number;
  project: {
    id: string;
    name: string;
  };
  tag: {
    id: string;
    name: string;
  };
}

export interface SessionPayloadDTO {
  focus: number;
  name: string;
  ratio?: number;
  rest?: number;
  projectId?: string;
  tagId?: string;
}
