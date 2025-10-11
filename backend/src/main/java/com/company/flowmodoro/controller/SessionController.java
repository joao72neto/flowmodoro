package com.company.flowmodoro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.flowmodoro.dto.SessionDTO;
import com.company.flowmodoro.mapper.SessionMapper;
import com.company.flowmodoro.model.Session;
import com.company.flowmodoro.service.SessionService;

@RestController
@RequestMapping("/api/session")
public class SessionController {
    
    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionMapper mapper;

    @PostMapping
    public ResponseEntity<SessionDTO> save(@RequestBody SessionDTO dto) {
        Session session = sessionService.save(mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDTO(session));
    }

    @GetMapping
    public ResponseEntity<List<SessionDTO>> consult() {
        List<Session> sessions = sessionService.consult();
        return ResponseEntity.ok(mapper.toDTO(sessions));
    }
}
