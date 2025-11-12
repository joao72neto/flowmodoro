package com.company.flowmodoro.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.flowmodoro.exception.InvalidSessionException;
import com.company.flowmodoro.model.Session;
import com.company.flowmodoro.repository.SessionRespository;

@Service
public class SessionService {

    private static final Double RATIO = 0.2;

    @Autowired
    private SessionRespository sessionRespository;

    public Session save(Session session) {
        calculateRest(session);
        validateSessions(session);
        return sessionRespository.save(session);
    }

    public List<Session> consult() {
        return sessionRespository.findAll();
    }

    // Private methods

    private void calculateRest(Session session) {
        if (session.getRatio() == null) {
            session.setRatio(RATIO);
        }
        double rest = session.getFocus() * session.getRatio();
        session.setRest(Math.round(rest * 100.0) / 100.0);
    }

    private void validateSessions(Session session) {

        List<String> errors = new ArrayList<>();

        if (session.getFocus() <= 0) {
            errors.add("Focus needs to be greater than 0");
        }

        if (session.getRatio() < 0 || session.getRatio() > 1) {
            errors.add("Ratio needs to be between 0 and 1");
        }

        if (session.getInterruptions() < 0) {
            errors.add("Interruptions can't be less than 0");
        }

        if (!errors.isEmpty()) {
            throw new InvalidSessionException(errors);
        }
    }
}
