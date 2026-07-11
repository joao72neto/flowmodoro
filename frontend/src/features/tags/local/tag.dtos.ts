export type TagDTO = {
  id: string;
  name: string;
  projectId: string;
  totalFocus: number;
};

export type TagPayloadDTO = {
  name: string;
  projectId: string;
};
