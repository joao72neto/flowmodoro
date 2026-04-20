package com.company.flowmodoro.features.session;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.flowmodoro.features.session.dtos.DailySessionsDTO;
import com.company.flowmodoro.features.session.dtos.SessionDTO;
import com.company.flowmodoro.features.session.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.session.mappers.SessionMapper;
import com.company.flowmodoro.shared.dto.PageResponse;

import org.springframework.web.bind.annotation.PathVariable;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://frontend-nkaw.onrender.com"
})
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
        SessionModel session = sessionService.save(mapper.toEntity(dto), id);
        return ResponseEntity.status(201).body(mapper.toDTO(session));
    }

    @GetMapping
    public ResponseEntity<PageResponse<DailySessionsDTO>> consult(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(sessionService.consult(page - 1, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionDTO> update(@PathVariable Long id, @RequestBody SessionUpdateDTO dto) {
        SessionModel session = sessionService.update(id, dto);
        return ResponseEntity.ok(mapper.toDTO(session));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sessionService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
