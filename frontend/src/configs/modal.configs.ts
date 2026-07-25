import type { VariantType } from "../shared/global.types";

interface IModalConfig {
  info: IModal;
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
  info: {
    title: "Aviso",
    children: "Este é um aviso padrão",
    closeButtonText: "Fechar",
    closeButtonVariant: "secondary40",
    confirmButtonText: "Confirmar",
    confirmButtonVariant: "primary",
  },
  default: {
    title: "Padrão'",
    children: "Este é o modal padrão",
    closeButtonText: "Fechar",
    closeButtonVariant: "secondary40",
    confirmButtonText: "Confirmar",
    confirmButtonVariant: "primary",
  },
  success: {
    title: "Sucesso!",
    children: "Operação foi realizada com sucesso!",
    closeButtonText: "Fechar",
    closeButtonVariant: "secondary",
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
    closeButtonVariant: "secondary40",
    confirmButtonText: "Confirmar",
    confirmButtonVariant: "secondary",
  },
};
