import type { VariantType } from "../shared/types/globals.types";

interface IModalConfig {
  default: IModal;
  success: IModal;
  error: IModal;
  warning: IModal;
}

interface IModal {
  title: string;
  children: string;
  closeButtonText: string;
  closeButtonVariant: VariantType;
  confirmButtonText: string;
  confirmButtonVariant: VariantType;
}

export const modalConfig: IModalConfig = {
  default: {
    title: "Aviso",
    children: "Este é um aviso padrão",
    closeButtonText: "Fechar",
    closeButtonVariant: "secondary",
    confirmButtonText: "Confirmar",
    confirmButtonVariant: "success",
  },
  success: {
    title: "Sucesso!",
    children: "Operação foi realizada com sucesso!",
    closeButtonText: "Fechar",
    closeButtonVariant: "danger",
    confirmButtonText: "Confirmar",
    confirmButtonVariant: "success",
  },
  error: {
    title: "Erro",
    children: "Ocorreu um erro ao realizar a operação",
    closeButtonText: "Fechar",
    closeButtonVariant: "danger",
    confirmButtonText: "Confirmar",
    confirmButtonVariant: "success",
  },
  warning: {
    title: "Atenção!",
    children: "Tem certeza que deseja realizar essa operação?",
    closeButtonText: "Cancelar",
    closeButtonVariant: "danger",
    confirmButtonText: "Confirmar",
    confirmButtonVariant: "success",
  },
};
