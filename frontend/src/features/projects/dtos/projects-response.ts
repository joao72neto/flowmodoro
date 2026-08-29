export interface ProjectDTO {
  id: string;
  name: string;
  totalFocus: number;
  color?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
