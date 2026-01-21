import SessionsWrapper from "./elements/SessionsWrapper";
import SessionsGroup from "./elements/SessionsGroup";
import Session from "./elements/Session";

import { sessionData } from "../../../data/sessions.data";

const SessionsDisplay = () => {
  return (
    <SessionsWrapper>
      {sessionData.map((sessionGroup) => (
        <SessionsGroup groupName={sessionGroup.date}>
          {sessionGroup.sessions.map((session) => (
            <Session
              activity={session.task.name}
              duration={session.focus.toString()}
            />
          ))}
        </SessionsGroup>
      ))}
    </SessionsWrapper>
  );
};

export default SessionsDisplay;
