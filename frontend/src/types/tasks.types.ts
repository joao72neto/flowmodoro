export interface TaskModel {
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
