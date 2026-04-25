package com.company.flowmodoro.features.session;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.session.dtos.DailySessionsDTO;
import com.company.flowmodoro.features.session.dtos.SessionDTO;
import com.company.flowmodoro.features.task.dtos.TaskDTO;

@Component
public class SessionAggregator {

    public List<DailySessionsDTO> groupSessionsByDate(List<SessionModel> sessions, List<LocalDate> orderedDates) {
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
        Map<Long, SessionDTO> tasksMap = new LinkedHashMap<>();
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
}
