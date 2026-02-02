import ModalContainer from "../common/modals/ModalContainer";
import { IoClose } from "react-icons/io5";
import Stack from "../common/Stack";

const SessionDetailsModal = ({
  sessionId,
  close,
}: {
  sessionId: number;
  close: () => void;
}) => {
  return (
    <ModalContainer>
      <Stack direction="row" justify="between">
        <h1 className="font-bold text-xl">Session Details</h1>
        <IoClose size={30} className="cursor-pointer" onClick={close} />
      </Stack>
    </ModalContainer>
  );
};

export default SessionDetailsModal;
