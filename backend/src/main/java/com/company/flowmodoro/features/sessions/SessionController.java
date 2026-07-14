package com.company.flowmodoro.features.sessions;

import com.company.flowmodoro.common.dto.PageResponse;
import com.company.flowmodoro.features.sessions.dtos.DailySessionsDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionCreateDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.sessions.mappers.SessionCreateMapper;
import com.company.flowmodoro.features.sessions.mappers.SessionMapper;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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

    @GetMapping
    public ResponseEntity<PageResponse<DailySessionsDTO>> consult(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        return ResponseEntity.ok(
            sessionService.consult(page - 1, size, userId)
        );
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<SessionDTO>> saveAll(
        @RequestBody List<@Valid SessionCreateDTO> dtos,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        List<SessionModel> sessions = sessionService.saveAll(
            createMapper.toEntity(dtos),
            userId
        );
        return ResponseEntity.status(201).body(mapper.toDTO(sessions));
    }

    @PostMapping
    public ResponseEntity<SessionDTO> save(
        @Valid @RequestBody SessionCreateDTO dto,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        SessionModel session = sessionService.save(
            createMapper.toEntity(dto),
            userId
        );
        return ResponseEntity.status(201).body(mapper.toDTO(session));
    }

    @PutMapping("/bulk")
    public ResponseEntity<List<SessionDTO>> updateAll(
        @RequestBody List<@Valid SessionUpdateDTO> dtos,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        List<SessionModel> sessions = sessionService.updateAll(dtos, userId);
        return ResponseEntity.ok(mapper.toDTO(sessions));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionDTO> update(
        @PathVariable UUID id,
        @Valid @RequestBody SessionUpdateDTO dto,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        SessionModel session = sessionService.update(id, dto, userId);
        return ResponseEntity.ok(mapper.toDTO(session));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteAll(
        @RequestBody List<UUID> ids,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        sessionService.deleteAll(ids, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable UUID id,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        sessionService.delete(id, userId);

        return ResponseEntity.noContent().build();
    }
}
