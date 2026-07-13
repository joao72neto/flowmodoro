package com.company.flowmodoro.features.sessions.helpers;

import com.company.flowmodoro.features.sessions.SessionModel;
import org.springframework.stereotype.Component;

@Component
public class SessionCalculator {

    public double calculateRatio(long focus, long rest) {
        if (rest == 0) return (double) focus;
        return (double) focus / rest;
    }

    public void calculateRest(SessionModel session, double ratio) {
        if (session.getRatio() == null) {
            session.setRatio(ratio);
        }
        double rest = session.getFocus() * session.getRatio();
        session.setRest(Math.round(rest));
    }
}
