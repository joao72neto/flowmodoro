export type TagPayload = {
  name: string;
  projectId: number;
};

export type TagResponse = {
  id: number;
  name: string;
  projectId: number;
  totalFocus?: number;
};
