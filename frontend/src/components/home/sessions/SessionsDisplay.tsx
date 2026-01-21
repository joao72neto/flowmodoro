import SessionsWrapper from "./elements/SessionsWrapper";
import SessionsGroup from "./elements/SessionsGroup";
import Session from "./elements/Session";

const SessionsDisplay = () => {
  return (
    <SessionsWrapper>
      <SessionsGroup groupName="Today (1h 20min | 15min)">
        <Session activity="Coding" duration="1h 20min" />
      </SessionsGroup>
    </SessionsWrapper>
  );
};

export default SessionsDisplay;
