package com.company.flowmodoro.features.sessions;

import com.company.flowmodoro.configs.security.CurrentUser;
import com.company.flowmodoro.features.sessions.dtos.SessionCreateDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.sessions.mappers.SessionCreateMapper;
import com.company.flowmodoro.features.sessions.mappers.SessionMapper;
import jakarta.validation.Valid;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    private final SessionMapper mapper;

    private final SessionCreateMapper createMapper;

    public SessionController(
        SessionService sessionService,
        SessionMapper mapper,
        SessionCreateMapper createMapper
    ) {
        this.sessionService = sessionService;
        this.mapper = mapper;
        this.createMapper = createMapper;
    }

    @GetMapping("/pull")
    public ResponseEntity<List<SessionDTO>> pullSessions(
        @RequestParam(required = false) @DateTimeFormat(
            iso = DateTimeFormat.ISO.DATE_TIME
        ) OffsetDateTime lastSync,
        @CurrentUser UUID userId
    ) {
        List<SessionModel> sessions = sessionService.pull(userId, lastSync);
        return ResponseEntity.ok(mapper.toDTO(sessions));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<SessionDTO>> saveAll(
        @RequestBody List<@Valid SessionCreateDTO> dtos,
        @CurrentUser UUID userId
    ) {
        List<SessionModel> sessions = sessionService.saveAll(
            createMapper.toEntity(dtos),
            userId
        );
        return ResponseEntity.status(201).body(mapper.toDTO(sessions));
    }

    @PutMapping("/bulk")
    public ResponseEntity<List<SessionDTO>> updateAll(
        @RequestBody List<@Valid SessionUpdateDTO> dtos,
        @CurrentUser UUID userId
    ) {
        List<SessionModel> sessions = sessionService.updateAll(dtos, userId);
        return ResponseEntity.ok(mapper.toDTO(sessions));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteAll(
        @RequestBody List<UUID> ids,
        @CurrentUser UUID userId
    ) {
        sessionService.deleteAll(ids, userId);
        return ResponseEntity.noContent().build();
    }
}
