package com.company.flowmodoro.features.sessions;

import com.company.flowmodoro.common.dto.PageResponse;
import com.company.flowmodoro.features.sessions.dtos.DailySessionsDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.sessions.helpers.SessionValidator;
import com.company.flowmodoro.features.sessions.mappers.SessionUpdateMapper;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    private final SessionAggregator aggregator;

    private final SessionValidator validator;

    private final SessionUpdateMapper updateMapper;

    public SessionService(
        SessionRepository sessionRepository,
        SessionUpdateMapper updateMapper,
        SessionAggregator aggregator,
        SessionValidator validator
    ) {
        this.sessionRepository = sessionRepository;
        this.updateMapper = updateMapper;

        this.aggregator = aggregator;
        this.validator = validator;
    }

    public PageResponse<DailySessionsDTO> consult(
        int page,
        int size,
        UUID userId
    ) {
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "date")
        );

        Page<LocalDate> datePage = sessionRepository.findDistinctDates(
            userId,
            pageable
        );

        if (datePage.isEmpty()) {
            return new PageResponse<>(List.of(), page, size, 0, 0);
        }

        List<SessionModel> sessions =
            sessionRepository.findByUserIdAndDateInOrderByIdDesc(
                userId,
                datePage.getContent()
            );

        List<DailySessionsDTO> dailySessions = aggregator.groupSessionsByDate(
            sessions,
            datePage.getContent()
        );

        return new PageResponse<>(
            dailySessions,
            datePage.getNumber() + 1,
            datePage.getSize(),
            datePage.getTotalElements(),
            datePage.getTotalPages()
        );
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
    public SessionModel save(SessionModel session, UUID userId) {
        SessionModel entity = validator.prepareSession(session, userId);
        return sessionRepository.save(entity);
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

    private SessionModel createFromBulkDTO(SessionUpdateDTO dto, UUID userId) {
        SessionModel session = updateMapper.toEntity(dto);
        session.setId(dto.getId());
        session.setName(dto.getName());

        validator.prepareSession(session, userId);
        return session;
    }

    @Transactional
    public SessionModel update(UUID id, SessionUpdateDTO dto, UUID userId) {
        SessionModel session = sessionRepository.findById(id).orElse(null);

        validator.validateSessionExists(session);

        validator.validateSessionBelongsToUser(session, userId);

        updateMapper.apply(dto, session);
        validator.validateProjectAndTag(session, userId);

        List<String> errors = new ArrayList<>();
        validator.validateSessions(session, errors);

        return sessionRepository.save(session);
    }

    @Transactional
    public void deleteAll(List<UUID> ids, UUID userId) {
        List<SessionModel> sessions = sessionRepository.findAllById(ids);

        validator.validateSessionsFound(ids, sessions);

        sessions.forEach(session -> {
            validator.validateSessionBelongsToUser(session, userId);
        });

        sessionRepository.deleteAll(sessions);
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        SessionModel session = sessionRepository.findById(id).orElse(null);

        validator.validateSessionExists(session);

        validator.validateSessionBelongsToUser(session, userId);

        sessionRepository.deleteById(id);
    }
}
