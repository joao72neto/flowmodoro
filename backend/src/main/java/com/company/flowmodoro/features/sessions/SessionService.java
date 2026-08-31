package com.company.flowmodoro.features.sessions;

import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.sessions.helpers.SessionValidator;
import com.company.flowmodoro.features.sessions.mappers.SessionUpdateMapper;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    private final SessionValidator validator;

    private final SessionUpdateMapper updateMapper;

    public SessionService(
        SessionRepository sessionRepository,
        SessionUpdateMapper updateMapper,
        SessionValidator validator
    ) {
        this.sessionRepository = sessionRepository;
        this.updateMapper = updateMapper;
        this.validator = validator;
    }

    @Transactional(readOnly = true)
    public List<SessionModel> pull(UUID userId, OffsetDateTime lastSync) {
        if (lastSync != null) {
            return sessionRepository.findByUserIdAndUpdatedAtGreaterThanEqualOrderByIdDesc(
                userId,
                lastSync
            );
        }
        return sessionRepository.findByUserIdOrderByIdDesc(userId);
    }

    @Transactional
    public List<SessionModel> saveAll(
        List<SessionModel> sessions,
        UUID userId
    ) {
        List<SessionModel> entities = sessions
            .stream()
            .map(session -> validator.prepareSession(session, userId))
            .toList();

        return sessionRepository.saveAll(entities);
    }

    @Transactional
    public List<SessionModel> updateAll(
        List<SessionUpdateDTO> dtos,
        UUID userId
    ) {
        List<UUID> ids = dtos.stream().map(SessionUpdateDTO::getId).toList();

        Map<UUID, SessionModel> existingSessions = sessionRepository
            .findAllById(ids)
            .stream()
            .collect(
                Collectors.toMap(SessionModel::getId, Function.identity())
            );

        List<String> errors = new ArrayList<>();

        List<SessionModel> entities = dtos
            .stream()
            .map(dto -> {
                SessionModel existing = existingSessions.get(dto.getId());

                if (existing == null) {
                    return createFromBulkDTO(dto, userId);
                }

                validator.validateSessions(updateMapper.toEntity(dto), errors);

                validator.validateSessionExists(existing);

                updateMapper.apply(dto, existing);

                existing.setUserId(userId);

                return existing;
            })
            .toList();

        return sessionRepository.saveAll(entities);
    }

    @Transactional
    public void deleteAll(List<UUID> ids, UUID userId) {
        List<SessionModel> sessions = sessionRepository.findAllById(ids);

        validator.validateSessionsFound(ids, sessions);

        sessions.forEach(session -> {
            validator.validateSessionBelongsToUser(session, userId);
            session.setDeletedAt(java.time.OffsetDateTime.now());
        });

        sessionRepository.saveAll(sessions);
    }

    private SessionModel createFromBulkDTO(SessionUpdateDTO dto, UUID userId) {
        SessionModel session = updateMapper.toEntity(dto);
        session.setId(dto.getId());
        session.setName(dto.getName());

        validator.prepareSession(session, userId);
        return session;
    }
}
