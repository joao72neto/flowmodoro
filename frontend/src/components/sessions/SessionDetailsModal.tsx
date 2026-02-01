import ModalContainer from "../common/modals/ModalContainer";

const SessionDetailsModal = ({ sessionId }: { sessionId: number }) => {
  return <ModalContainer>Detalhes da sessão de id {sessionId}</ModalContainer>;
};

export default SessionDetailsModal;
