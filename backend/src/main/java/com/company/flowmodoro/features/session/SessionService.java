package com.company.flowmodoro.features.session;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.flowmodoro.features.session.dtos.DailySessionsDTO;
import com.company.flowmodoro.features.session.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.session.enums.SessionErrorCode;
import com.company.flowmodoro.features.session.exceptions.InvalidSessionException;
import com.company.flowmodoro.features.session.helpers.SessionCalculator;
import com.company.flowmodoro.features.session.helpers.SessionValidator;
import com.company.flowmodoro.features.session.mappers.SessionUpdateMapper;
import com.company.flowmodoro.features.task.TaskModel;
import com.company.flowmodoro.features.task.TaskRepository;
import com.company.flowmodoro.features.task.enums.TaskErrorCode;
import com.company.flowmodoro.features.task.exceptions.InvalidTaskException;
import com.company.flowmodoro.shared.dto.PageResponse;

@Service
public class SessionService {

    private static final SessionErrorCode SESSION_NOT_FOUND = SessionErrorCode.SESSION_NOT_FOUND;
    private static final TaskErrorCode TASK_NOT_FOUND = TaskErrorCode.TASK_NOT_FOUND;

    private final SessionRespository sessionRepository;
    private final TaskRepository taskRepository;
    private final SessionUpdateMapper sessionUpdateMapper;

    private final SessionAggregator aggregator;
    private final SessionCalculator calculator;
    private final SessionValidator validator;

    public SessionService(
            SessionRespository sessionRepository,
            TaskRepository taskRepository,
            SessionUpdateMapper sessionUpdateMapper,

            SessionAggregator aggregator,
            SessionCalculator calculator,
            SessionValidator validator) {

        this.sessionRepository = sessionRepository;
        this.taskRepository = taskRepository;
        this.sessionUpdateMapper = sessionUpdateMapper;

        this.aggregator = aggregator;
        this.calculator = calculator;
        this.validator = validator;
    }

    @Transactional
    public SessionModel save(SessionModel session, Long taskId) {

        List<String> errors = new ArrayList<>();

        if (taskId == null) {
            errors.add("Task id can't be null");
            throw new InvalidTaskException(TaskErrorCode.TASK_ID_CAN_NOT_BE_NULL, errors);
        }

        TaskModel task = taskRepository.findById(taskId)
                .orElseThrow(() -> new InvalidTaskException(
                        TASK_NOT_FOUND, "Task not found"));

        calculator.calculateRest(session);
        validator.validateSessions(session, errors);

        Optional<SessionModel> existingSession = sessionRepository
                .findByTaskIdAndDate(taskId, session.getDate());

        if (existingSession.isPresent()) {
            SessionModel existing = existingSession.get();
            existing.setFocus(existing.getFocus() + session.getFocus());
            existing.setRest(existing.getRest() + session.getRest());
            existing.setInterruptions(existing.getInterruptions() + session.getInterruptions());
            existing.setRatio(calculator.calculateRatio(existing.getFocus(), existing.getRest()));

            return sessionRepository.save(existing);
        } else {
            session.setTask(task);
            return sessionRepository.save(session);
        }
    }

    public PageResponse<DailySessionsDTO> consult(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<LocalDate> datePage = sessionRepository.findDistinctDates(pageable);

        if (datePage.isEmpty()) {
            return new PageResponse<>(List.of(), page, size, 0, 0);
        }

        List<SessionModel> sessions = sessionRepository.findByDateInOrderByIdDesc(datePage.getContent());

        List<DailySessionsDTO> dailySessions = aggregator.groupSessionsByDate(sessions, datePage.getContent());

        return new PageResponse<>(
                dailySessions,
                datePage.getNumber() + 1,
                datePage.getSize(),
                datePage.getTotalElements(),
                datePage.getTotalPages());
    }

    @Transactional
    public SessionModel update(Long id, SessionUpdateDTO dto) {
        SessionModel session = sessionRepository.findById(id)
                .orElseThrow(() -> new InvalidSessionException(
                        SESSION_NOT_FOUND,
                        "Session not found with id: " + id));

        TaskModel task = taskRepository.findById(dto.getTask())
                .orElseThrow(() -> new InvalidTaskException(
                        TASK_NOT_FOUND,
                        "Task not found with id: " + dto.getTask()));

        sessionUpdateMapper.apply(session, dto);
        session.setTask(task);
        return sessionRepository.save(session);
    }

    @Transactional
    public void delete(Long id) {
        sessionRepository.findById(id)
                .orElseThrow(() -> new InvalidSessionException(
                        SESSION_NOT_FOUND,
                        "Session not found with id: " + id));

        sessionRepository.deleteById(id);
    }
}
