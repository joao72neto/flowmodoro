package com.company.flowmodoro.features.session;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.util.Comparator;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.flowmodoro.features.session.dtos.DailySessionsDTO;
import com.company.flowmodoro.features.session.dtos.SessionDTO;
import com.company.flowmodoro.features.session.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.session.enums.SessionErrorCode;
import com.company.flowmodoro.features.session.exceptions.InvalidSessionException;
import com.company.flowmodoro.features.session.mappers.SessionUpdateMapper;
import com.company.flowmodoro.features.task.TaskModel;
import com.company.flowmodoro.features.task.TaskRepository;
import com.company.flowmodoro.features.task.dtos.TaskDTO;
import com.company.flowmodoro.features.task.enums.TaskErrorCode;
import com.company.flowmodoro.features.task.exceptions.InvalidTaskException;
import com.company.flowmodoro.shared.dto.PageResponse;

@Service
public class SessionService {

    private static final Double RATIO = 0.2;
    private static final SessionErrorCode SESSION_NOT_FOUND = SessionErrorCode.SESSION_NOT_FOUND;
    private static final TaskErrorCode TASK_NOT_FOUND = TaskErrorCode.TASK_NOT_FOUND;

    private final SessionRespository sessionRepository;
    private final TaskRepository taskRepository;
    private final SessionUpdateMapper sessionUpdateMapper;

    public SessionService(SessionRespository sessionRepository, TaskRepository taskRepository,
            SessionUpdateMapper sessionUpdateMapper) {
        this.sessionRepository = sessionRepository;
        this.taskRepository = taskRepository;
        this.sessionUpdateMapper = sessionUpdateMapper;
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

        calculateRest(session);
        validateSessions(session, errors);

        Optional<SessionModel> existingSession = sessionRepository
                .findByTaskIdAndDate(taskId, session.getDate());

        if (existingSession.isPresent()) {
            SessionModel existing = existingSession.get();
            existing.setFocus(existing.getFocus() + session.getFocus());
            existing.setRest(existing.getRest() + session.getRest());
            existing.setInterruptions(existing.getInterruptions() + session.getInterruptions());
            existing.setRatio(calculateRatio(existing.getFocus(), existing.getRest()));

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

        List<DailySessionsDTO> dailySessions = groupSessionsByDate(sessions, datePage.getContent());

        return new PageResponse<>(
                dailySessions,
                datePage.getNumber(),
                datePage.getSize(),
                datePage.getTotalElements(),
                datePage.getTotalPages());
    }

    private List<DailySessionsDTO> groupSessionsByDate(List<SessionModel> sessions, List<LocalDate> orderedDates) {
        Map<LocalDate, List<SessionModel>> sessionsByDay = sessions.stream()
                .collect(Collectors.groupingBy(SessionModel::getDate));

        List<DailySessionsDTO> result = new ArrayList<>();

        for (LocalDate date : orderedDates) {
            List<SessionModel> daySessions = sessionsByDay.getOrDefault(date, List.of());
            result.add(aggregateSessionsForOneDay(date, daySessions));
        }

        return result;
    }

    private DailySessionsDTO aggregateSessionsForOneDay(LocalDate date, List<SessionModel> daySessions) {
        Map<Long, SessionDTO> tasksMap = new HashMap<>();
        double totalFocus = 0;
        double totalRest = 0;

        for (SessionModel s : daySessions) {
            totalFocus += s.getFocus();
            totalRest += s.getRest();
            Long taskId = s.getTask().getId();

            if (tasksMap.containsKey(taskId)) {
                SessionDTO acc = tasksMap.get(taskId);
                acc.setFocus(acc.getFocus() + s.getFocus());
                acc.setRest(acc.getRest() + s.getRest());
                acc.setInterruptions(acc.getInterruptions() + s.getInterruptions());
            } else {
                SessionDTO dto = SessionDTO.builder()
                        .id(s.getId())
                        .focus(s.getFocus())
                        .rest(s.getRest())
                        .ratio(s.getRatio())
                        .interruptions(s.getInterruptions())
                        .task(TaskDTO.builder()
                                .id(s.getTask().getId())
                                .name(s.getTask().getName())
                                .checked(s.getTask().getChecked())
                                .build())
                        .build();
                tasksMap.put(taskId, dto);
            }
        }

        return DailySessionsDTO.builder()
                .date(date)
                .totalFocus(totalFocus)
                .totalRest(totalRest)
                .sessions(new ArrayList<>(tasksMap.values()))
                .build();
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

    // Private methods

    private double calculateRatio(double focus, double rest) {
        if (rest == 0)
            return focus;
        return focus / rest;
    }

    private void calculateRest(SessionModel session) {
        if (session.getRatio() == null) {
            session.setRatio(RATIO);
        }
        double rest = session.getFocus() * session.getRatio();
        session.setRest(Math.round(rest * 100.0) / 100.0);
    }

    private void validateSessions(SessionModel session, List<String> errors) {

        if (session.getFocus() <= 0) {
            errors.add("Focus needs to be greater than 0");
        }

        if (session.getRatio() < 0 || session.getRatio() > 1) {
            errors.add("Ratio needs to be between 0 and 1");
        }

        if (session.getInterruptions() < 0) {
            errors.add("Interruptions can't be less than 0");
        }

        if (!errors.isEmpty()) {
            throw new InvalidSessionException(SessionErrorCode.INVALID_SESSION, errors);
        }
    }
}
