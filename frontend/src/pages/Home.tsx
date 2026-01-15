import Counter from "../components/home/timer/Counter";
import Interruptions from "../components/home/timer/Interruptions";
import TaskSelector from "../components/home/timer/TaskSelector";
import MainLayout from "../layouts/MainLayout";
import Stack from "../components/common/Stack";

import Sessions from "../components/home/Sessions";

function Home() {
  return (
    <MainLayout>
      <Stack gap={0}>
        <TaskSelector />
        <Interruptions />
        <Counter />
      </Stack>
      <Sessions />
    </MainLayout>
  );
}

export default Home;
