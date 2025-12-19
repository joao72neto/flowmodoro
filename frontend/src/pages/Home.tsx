import Timer from "./components/Timer";
import Interruptions from "./components/Interruptions";
import TaskSelector from "./components/TaskSelector";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import IconButton from "./components/buttons/IconButton";
import Modal from "../components/modals/Modal";
import { useSession } from "../hooks/useSession";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { error, success } = useSession();

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (error || success) {
      setShowModal(true);
    }
  }, [error, success]);

  return (
    <>
      <div className="flex">
        <div
          className={`flex flex-col items-center justify-center min-h-screen p-6 transition-w duration-300 ${
            isSidebarOpen ? "w-2/3" : "w-full"
          }`}
        >
          <TaskSelector />
          <Interruptions />
          <Timer />
        </div>
        <div
          className={`fixed top-0 right-0 w-1/3 z-20 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SideBar onClick={() => setIsSidebarOpen(!isSidebarOpen)}></SideBar>
        </div>
        <div className="fixed top-0 right-0 p-3">
          <IconButton
            icon={
              <i className={`${!isSidebarOpen ? "bi bi-caret-left" : ""}`} />
            }
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
      </div>

      {showModal && (
        <Modal
          onClose={handleCloseModal}
          title={error ? "Erro :(" : "Sucesso!"}
        >
          {error ?? success ?? "Nada aconteceu"}
        </Modal>
      )}
    </>
  );
}

export default Home;
