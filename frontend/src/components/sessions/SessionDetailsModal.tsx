import ModalContainer from "../common/modals/ModalContainer";
import Button from "../common/Button";

const SessionDetailsModal = ({
  sessionId,
  close,
}: {
  sessionId: number;
  close: () => void;
}) => {
  return (
    <ModalContainer>
      <p>Detalhes da sessão de id {sessionId}</p>
      <Button onClick={close}>Fechar</Button>
    </ModalContainer>
  );
};

export default SessionDetailsModal;
