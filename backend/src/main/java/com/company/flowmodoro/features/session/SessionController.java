package com.company.flowmodoro.features.session;

import org.springframework.http.ResponseEntity;
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

import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/session")
public class SessionController {

	private final SessionService sessionService;

	private final SessionMapper mapper;

	public SessionController(SessionService sessionService, SessionMapper mapper) {
		this.sessionService = sessionService;
		this.mapper = mapper;
	}

	@PostMapping("/{id}")
	public ResponseEntity<SessionDTO> save(@PathVariable Long id, @RequestBody SessionDTO dto,
			@RequestHeader("X-User-Id") String userId) {
		SessionModel session = sessionService.save(mapper.toEntity(dto), id, userId);
		return ResponseEntity.status(201).body(mapper.toDTO(session));
	}

	@GetMapping
	public ResponseEntity<PageResponse<DailySessionsDTO>> consult(@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int size, @RequestHeader("X-User-Id") String userId) {
		return ResponseEntity.ok(sessionService.consult(page - 1, size, userId));
	}

	@PutMapping("/{id}")
	public ResponseEntity<SessionDTO> update(@PathVariable Long id, @RequestBody SessionUpdateDTO dto,
			@RequestHeader("X-User-Id") String userId) {
		SessionModel session = sessionService.update(id, dto, userId);
		return ResponseEntity.ok(mapper.toDTO(session));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id, @RequestHeader("X-User-Id") String userId) {
		sessionService.delete(id, userId);

		return ResponseEntity.noContent().build();
	}

}
