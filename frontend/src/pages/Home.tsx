import Timer from "../components/home/Timer";
import Interruptions from "../components/home/Interruptions";
import TaskSelector from "../components/home/TaskSelector";
import { useSessionContext } from "../hooks/sessions/useSessionContext";
import MainLayout from "../layouts/MainLayout";
import Modal from "../components/common/modals/Modal";
function Home() {
  const { error, success } = useSessionContext();

  return (
    <>
      <MainLayout>
        <TaskSelector />
        <Interruptions />
        <Timer />
      </MainLayout>

      {error && <Modal type="error" />}
      {success && <Modal type="success" />}
    </>
  );
}

export default Home;
