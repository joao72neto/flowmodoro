export interface TaskModel {
  name: string;
  checked: boolean;
}

export interface UpdateTaskRequest {
  checked: boolean;
}
