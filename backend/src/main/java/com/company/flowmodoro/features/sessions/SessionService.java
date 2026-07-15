package com.company.flowmodoro.features.sessions;

import com.company.flowmodoro.common.dto.PageResponse;
import com.company.flowmodoro.features.sessions.dtos.DailySessionsDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.sessions.enums.SessionErrorCode;
import com.company.flowmodoro.features.sessions.exceptions.InvalidSessionException;
import com.company.flowmodoro.features.sessions.helpers.SessionValidator;
import com.company.flowmodoro.features.sessions.mappers.SessionUpdateMapper;
import java.time.LocalDate;
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

    private static final SessionErrorCode SESSION_NOT_FOUND =
        SessionErrorCode.SESSION_NOT_FOUND;

    private final SessionRepository sessionRepository;

    private final SessionAggregator aggregator;

    private final SessionValidator validator;

    private final SessionUpdateMapper sessionUpdateMapper;

    public SessionService(
        SessionRepository sessionRepository,
        SessionUpdateMapper sessionUpdateMapper,
        SessionAggregator aggregator,
        SessionValidator validator
    ) {
        this.sessionRepository = sessionRepository;
        this.sessionUpdateMapper = sessionUpdateMapper;

        this.aggregator = aggregator;
        this.validator = validator;
    }

    public List<SessionModel> consultAll(UUID userId) {
        List<SessionModel> sessions = sessionRepository.findByUserId(userId);
        return sessions;
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
        List<SessionUpdateDTO> sessions,
        UUID userId
    ) {
        Map<UUID, SessionUpdateDTO> updates = sessions
            .stream()
            .collect(
                Collectors.toMap(SessionUpdateDTO::getId, Function.identity())
            );

        List<SessionModel> entities = sessionRepository.findAllById(
            updates.keySet()
        );

        if (entities.size() != sessions.size()) {
            throw new InvalidSessionException(
                SESSION_NOT_FOUND,
                "Session not found for one or more ids"
            );
        }

        List<String> errors = new ArrayList<>();
        entities.forEach(entity -> {
            SessionUpdateDTO dto = updates.get(entity.getId());
            sessionUpdateMapper.apply(dto, entity);
            validator.validateSessions(entity, errors);
        });

        return sessionRepository.saveAll(entities);
    }

    @Transactional
    public SessionModel update(UUID id, SessionUpdateDTO dto, UUID userId) {
        SessionModel session = sessionRepository
            .findById(id)
            .orElseThrow(() ->
                new InvalidSessionException(
                    SESSION_NOT_FOUND,
                    "Session not found with id: " + id
                )
            );

        if (!session.getUserId().equals(userId)) {
            throw new InvalidSessionException(
                SESSION_NOT_FOUND,
                "Session not found for this user"
            );
        }

        sessionUpdateMapper.apply(dto, session);
        validator.validateProjectAndTag(session, userId);

        List<String> errors = new ArrayList<>();
        validator.validateSessions(session, errors);

        return sessionRepository.save(session);
    }

    @Transactional
    public void deleteAll(List<UUID> ids, UUID userId) {
        List<SessionModel> sessions = sessionRepository.findAllById(ids);

        if (sessions.size() != ids.size()) {
            throw new InvalidSessionException(
                SESSION_NOT_FOUND,
                "Session not found for one or more ids"
            );
        }

        sessions.forEach(session -> {
            if (!session.getUserId().equals(userId)) {
                throw new InvalidSessionException(
                    SESSION_NOT_FOUND,
                    "Session not found for this user"
                );
            }
        });

        sessionRepository.deleteAll(sessions);
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        SessionModel session = sessionRepository
            .findById(id)
            .orElseThrow(() ->
                new InvalidSessionException(
                    SESSION_NOT_FOUND,
                    "Session not found with id: " + id
                )
            );

        if (!session.getUserId().equals(userId)) {
            throw new InvalidSessionException(
                SESSION_NOT_FOUND,
                "Session not found for this user"
            );
        }

        sessionRepository.deleteById(id);
    }
}
