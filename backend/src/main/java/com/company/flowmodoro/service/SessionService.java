package com.company.flowmodoro.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.flowmodoro.exception.InvalidSessionException;
import com.company.flowmodoro.model.Session;
import com.company.flowmodoro.model.Task;
import com.company.flowmodoro.repository.SessionRespository;
import com.company.flowmodoro.repository.TaskRepository;
import com.company.flowmodoro.dto.TaskDTO;
import com.company.flowmodoro.dto.sessions.DailySessionsDTO;
import com.company.flowmodoro.dto.sessions.SessionDTO;
import com.company.flowmodoro.enums.ErrorCode;

@Service
public class SessionService {

    private static final Double RATIO = 0.2;
    private static final ErrorCode ERROR_CODE = ErrorCode.TASK_NOT_FOUND;

    @Autowired
    private SessionRespository sessionRespository;

    @Autowired
    private TaskRepository taskRepository;

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

        session.setTask(task);

        return sessionRespository.save(session);
    }

    public List<DailySessionsDTO> consult() {
        List<Session> sessions = sessionRespository.findAllByOrderByIdDesc();

        Map<LocalDate, List<Session>> sessionsByDate = sessions.stream()
                .collect(Collectors.groupingBy(Session::getDate));

        return sessionsByDate.entrySet().stream()
                .map((Map.Entry<LocalDate, List<Session>> entry) -> {
                    LocalDate date = entry.getKey();
                    List<Session> daySessions = entry.getValue();

                    double totalFocus = daySessions.stream()
                            .mapToDouble(Session::getFocus)
                            .sum();

                    double totalRest = daySessions.stream()
                            .mapToDouble(Session::getRest)
                            .sum();

                    List<SessionDTO> sessionDTOs = daySessions.stream()
                            .map((Session s) -> SessionDTO.builder()
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
                                    .build())
                            .toList();

                    return DailySessionsDTO.builder()
                            .date(date)
                            .totalFocus(totalFocus)
                            .totalRest(totalRest)
                            .sessions(sessionDTOs)
                            .build();
                })
                .toList();

    }

    // Private methods

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
