package com.company.flowmodoro.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.util.Comparator;
import java.util.HashMap;
import java.util.TreeMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.flowmodoro.exception.InvalidSessionException;
import com.company.flowmodoro.exception.InvalidTaskException;
import com.company.flowmodoro.mapper.sessions.SessionUpdateMapper;
import com.company.flowmodoro.model.Session;
import com.company.flowmodoro.model.Task;
import com.company.flowmodoro.repository.SessionRespository;
import com.company.flowmodoro.repository.TaskRepository;
import com.company.flowmodoro.dto.sessions.DailySessionsDTO;
import com.company.flowmodoro.dto.sessions.SessionDTO;
import com.company.flowmodoro.dto.sessions.SessionUpdateDTO;
import com.company.flowmodoro.dto.tasks.TaskDTO;
import com.company.flowmodoro.enums.ErrorCode;

@Service
public class SessionService {

    private static final Double RATIO = 0.2;
    private static final ErrorCode ERROR_CODE = ErrorCode.TASK_NOT_FOUND;

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
    public Session save(Session session, Long taskId) {

        List<String> errors = new ArrayList<>();

        if (taskId == null) {
            errors.add("Task id can't be null");
            throw new InvalidSessionException(ErrorCode.TASK_ID_CAN_NOT_BE_NULL, errors);
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new InvalidSessionException(
                        ERROR_CODE, "Task not found"));

        calculateRest(session);
        validateSessions(session, errors);

        Optional<Session> existingSession = sessionRepository
                .findByTaskIdAndDate(taskId, session.getDate());

        if (existingSession.isPresent()) {
            Session existing = existingSession.get();
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

    public List<DailySessionsDTO> consult() {
        List<Session> sessions = sessionRepository.findAllByOrderByIdDesc();
        Map<LocalDate, Map<Long, SessionDTO>> accByDay = new TreeMap<>(Comparator.reverseOrder());

        for (Session s : sessions) {
            LocalDate date = s.getDate();
            Long taskId = s.getTask().getId();

            accByDay.putIfAbsent(date, new HashMap<>());
            Map<Long, SessionDTO> accByTask = accByDay.get(date);

            if (accByTask.containsKey(taskId)) {
                SessionDTO acc = accByTask.get(taskId);
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
                accByTask.put(taskId, dto);
            }
        }

        return accByDay.entrySet().stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    Map<Long, SessionDTO> dayTasks = entry.getValue();

                    double totalFocus = dayTasks.values().stream()
                            .mapToDouble(SessionDTO::getFocus)
                            .sum();

                    double totalRest = dayTasks.values().stream()
                            .mapToDouble(SessionDTO::getRest)
                            .sum();

                    return DailySessionsDTO.builder()
                            .date(date)
                            .totalFocus(totalFocus)
                            .totalRest(totalRest)
                            .sessions(new ArrayList<>(dayTasks.values()))
                            .build();
                })
                .toList();

    }

    @Transactional
    public Session update(Long id, SessionUpdateDTO dto) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new InvalidSessionException(
                        ErrorCode.SESSION_NOT_FOUND,
                        "Session not found with id: " + id));

        Task task = taskRepository.findById(dto.getTask())
                .orElseThrow(() -> new InvalidTaskException(
                        ERROR_CODE,
                        "Task not found with id: " + dto.getTask()));

        sessionUpdateMapper.apply(session, dto);
        session.setTask(task);
        return sessionRepository.save(session);
    }

    public void delete(Long id) {
        sessionRepository.deleteById(id);
    }

    // Private methods

    private double calculateRatio(double focus, double rest) {
        if (rest == 0)
            return focus;
        return focus / rest;
    }

    private void calculateRest(Session session) {
        if (session.getRatio() == null) {
            session.setRatio(RATIO);
        }
        double rest = session.getFocus() * session.getRatio();
        session.setRest(Math.round(rest * 100.0) / 100.0);
    }

    private void validateSessions(Session session, List<String> errors) {

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
            throw new InvalidSessionException(ErrorCode.INVALID_SESSION, errors);
        }
    }
}
