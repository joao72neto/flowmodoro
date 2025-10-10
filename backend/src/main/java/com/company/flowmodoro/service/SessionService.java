package com.company.flowmodoro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.flowmodoro.model.entity.Session;
import com.company.flowmodoro.repository.SessionRespository;

@Service
public class SessionService {

    @Autowired
    private SessionRespository sessionRespository;
    
    public Session save(Session session) {
        return sessionRespository.save(session);
    }
}
