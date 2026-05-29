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
import com.company.flowmodoro.features.session.dtos.SessionGroupDTO;
import com.company.flowmodoro.features.session.mappers.SessionMapper;

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
		Map<String, SessionGroupDTO> groupsMap = new LinkedHashMap<>();
		long dailyTotalFocus = 0;
		long dailyTotalRest = 0;

		for (SessionModel sessionModel : daySessions) {
			dailyTotalFocus += sessionModel.getFocus();
			dailyTotalRest += sessionModel.getRest();

			String name = sessionModel.getName() != null ? sessionModel.getName() : "Sem nome";
			String groupKey = name;

			SessionDTO currentSessionDTO = sessionMapper.toDTO(sessionModel);

			if (groupsMap.containsKey(groupKey)) {
				SessionGroupDTO existingGroup = groupsMap.get(groupKey);
				existingGroup.setTotalFocus(existingGroup.getTotalFocus() + sessionModel.getFocus());
				existingGroup.setTotalRest(existingGroup.getTotalRest() + sessionModel.getRest());
				existingGroup.getSessions().add(currentSessionDTO);
			}
			else {
				List<SessionDTO> initialSessionsList = new ArrayList<>();
				initialSessionsList.add(currentSessionDTO);

				SessionGroupDTO newGroup = SessionGroupDTO.builder()
					.name(name)
					.totalFocus(sessionModel.getFocus())
					.totalRest(sessionModel.getRest())
					.sessions(initialSessionsList)
					.build();

				groupsMap.put(groupKey, newGroup);
			}
		}

		return DailySessionsDTO.builder()
			.date(date)
			.totalFocus(dailyTotalFocus)
			.totalRest(dailyTotalRest)
			.sessionGroups(new ArrayList<>(groupsMap.values()))
			.build();
	}

}
