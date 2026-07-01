export type ModalType = "warning" | "error" | "success" | "default" | "info";
export type VariantType =
  | "secondary"
  | "danger"
  | "secondary40"
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
