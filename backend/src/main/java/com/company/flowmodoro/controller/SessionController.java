package com.company.flowmodoro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.flowmodoro.model.entity.Session;
import com.company.flowmodoro.service.SessionService;

@RestController
@RequestMapping("/api/session")
public class SessionController {
    
    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<Session> save(@RequestBody Session session) {
        return ResponseEntity.ok(sessionService.save(session));
    }
}
