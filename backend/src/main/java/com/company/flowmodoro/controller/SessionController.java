package com.company.flowmodoro.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.company.flowmodoro.dto.sessions.DailySessionsDTO;
import com.company.flowmodoro.dto.sessions.SessionDTO;
import com.company.flowmodoro.mapper.SessionMapper;
import com.company.flowmodoro.model.Session;
import com.company.flowmodoro.service.SessionService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;
    private final SessionMapper mapper;

    public SessionController(SessionService sessionService, SessionMapper mapper) {
        this.sessionService = sessionService;
        this.mapper = mapper;
    }

    @PostMapping("/{id}")
    public ResponseEntity<SessionDTO> save(@PathVariable Long id, @RequestBody SessionDTO dto) {
        Session session = sessionService.save(mapper.toEntity(dto), id);
        return ResponseEntity.status(201).body(mapper.toDTO(session));
    }

    @GetMapping
    public ResponseEntity<List<DailySessionsDTO>> consult() {
        return ResponseEntity.ok(sessionService.consult());
    }

    @PutMapping
    public ResponseEntity<SessionDTO> update(@RequestBody SessionDTO dto) {
        Session session = sessionService.update(mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDTO(session));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sessionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
