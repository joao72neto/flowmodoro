package com.company.flowmodoro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.flowmodoro.exception.InvalidSessionException;
import com.company.flowmodoro.model.entity.Session;
import com.company.flowmodoro.repository.SessionRespository;

@Service
public class SessionService {

    @Autowired
    private SessionRespository sessionRespository;

    public Session save(Session session) {
        validateSessions(session);
        return sessionRespository.save(session);
    }

    private void validateSessions(Session session) {

        if (session.getFocus() <= 0) {
            throw new InvalidSessionException("Focus needs to be greater than 0");
        }

        if (session.getRest() <= 0) {
            throw new InvalidSessionException("Rest needs to be greater than 0");
        }

        if (session.getInterruptions() < 0) {
            throw new InvalidSessionException("Interruptions can't be less than 0");
        }
    }
}
