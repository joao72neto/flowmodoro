export interface TaskResponse {
  id: number;
  name: string;
  checked: boolean;
}

export interface TaskRequest {
  name: string;
  checked: boolean;
}

export interface UpdateTaskRequest {
  checked: boolean;
}

export interface UpdateTaskNameRequest {
  name: string;
}
