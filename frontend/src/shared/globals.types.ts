export type ModalType = "warning" | "error" | "success" | "default";
export type VariantType =
  | "secondary"
  | "danger"
  | "danger2"
  | "primary"
  | "success"
  | "success2";

export interface PaginationResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
