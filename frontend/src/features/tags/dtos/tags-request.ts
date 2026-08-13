export type TagPayloadDTO = {
  id: string;
  name: string;
  projectId: string;
};

export type TagUpdateBulkDTO = {
  id: string;
  name: string;
  projectId?: string;
};

export type TagUpdateDTO = {
  name: string;
  projectId: string;
};
