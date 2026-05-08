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
import com.company.flowmodoro.features.session.mappers.SessionMapper;
import com.company.flowmodoro.features.task.dtos.TaskDTO;
import com.company.flowmodoro.features.task.dtos.TaskGroupDTO;

@Component
public class SessionAggregator {

	private final SessionMapper sessionMapper;

	public SessionAggregator(SessionMapper sessionMapper) {
		this.sessionMapper = sessionMapper;
	}

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
		Map<String, TaskGroupDTO> tasksMap = new LinkedHashMap<>();
		long dailyTotalFocus = 0;
		long dailyTotalRest = 0;

		for (SessionModel sessionModel : daySessions) {
			dailyTotalFocus += sessionModel.getFocus();
			dailyTotalRest += sessionModel.getRest();

			Long tskId = sessionModel.getTaskSnapshotId();
			String groupKey = tskId != null ? "TASK_" + tskId : "SESSION_" + sessionModel.getId();

			SessionDTO currentSessionDTO = sessionMapper.toDTO(sessionModel);

			if (tasksMap.containsKey(groupKey)) {
				TaskGroupDTO existingGroup = tasksMap.get(groupKey);
				existingGroup.setTaskTotalFocus(existingGroup.getTaskTotalFocus() + sessionModel.getFocus());
				existingGroup.setTaskTotalRest(existingGroup.getTaskTotalRest() + sessionModel.getRest());
				existingGroup.getSessions().add(currentSessionDTO);
			} else {
				TaskDTO taskDTO = TaskDTO.builder()
						.id(tskId)
						.name(sessionModel.getTaskSnapshotName())
						.checked(sessionModel.getTask() != null ? sessionModel.getTask().getChecked() : false)
						.build();

				List<SessionDTO> initialSessionsList = new ArrayList<>();
				initialSessionsList.add(currentSessionDTO);

				TaskGroupDTO newGroup = TaskGroupDTO.builder()
						.task(taskDTO)
						.taskTotalFocus(sessionModel.getFocus())
						.taskTotalRest(sessionModel.getRest())
						.sessions(initialSessionsList)
						.build();

				tasksMap.put(groupKey, newGroup);
			}
		}

		return DailySessionsDTO.builder()
				.date(date)
				.totalFocus(dailyTotalFocus)
				.totalRest(dailyTotalRest)
				.taskGroups(new ArrayList<>(tasksMap.values()))
				.build();
	}

}
