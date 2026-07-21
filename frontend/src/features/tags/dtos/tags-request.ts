export type TagCreateDTO = {
  id: string;
  name: string;
  projectId: string;
};

export type TagUpdateBulkDTO = {
  id: string;
  name: string;
};

export type TagPayloadDTO = {
  name: string;
  projectId: string;
};
