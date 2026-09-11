export interface ProjectPayloadDTO {
  id: string;
  name: string;
  color?: string;
}

export interface ProjectUpdateDTO {
  name: string;
  color?: string;
}
