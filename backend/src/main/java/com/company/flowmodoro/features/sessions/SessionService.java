package com.company.flowmodoro.features.sessions;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.flowmodoro.common.dto.PageResponse;
import com.company.flowmodoro.features.sessions.dtos.DailySessionsDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.sessions.enums.SessionErrorCode;
import com.company.flowmodoro.features.sessions.exceptions.InvalidSessionException;
import com.company.flowmodoro.features.sessions.helpers.ProjectTagValidator;
import com.company.flowmodoro.features.sessions.helpers.SessionCalculator;
import com.company.flowmodoro.features.sessions.helpers.SessionValidator;
import com.company.flowmodoro.features.sessions.mappers.SessionUpdateMapper;

@Service
public class SessionService {

	private static final SessionErrorCode SESSION_NOT_FOUND = SessionErrorCode.SESSION_NOT_FOUND;

	private final SessionRespository sessionRepository;

	private final SessionUpdateMapper sessionUpdateMapper;

	private final SessionAggregator aggregator;

	private final SessionCalculator calculator;

	private final SessionValidator validator;

	private final ProjectTagValidator projectTagValidator;

	public SessionService(SessionRespository sessionRepository, SessionUpdateMapper sessionUpdateMapper,

			SessionAggregator aggregator, SessionCalculator calculator, SessionValidator validator,
			ProjectTagValidator projectTagValidator) {

		this.sessionRepository = sessionRepository;
		this.sessionUpdateMapper = sessionUpdateMapper;

		this.aggregator = aggregator;
		this.calculator = calculator;
		this.validator = validator;
		this.projectTagValidator = projectTagValidator;
	}

	@Transactional
	public SessionModel save(SessionModel session, String userId) {

		List<String> errors = new ArrayList<>();

		if (session.getDate() == null) {
			session.setDate(LocalDate.now());
		}

		if (session.getRatio() == null) {
			session.setRatio(0.2);
		}

		projectTagValidator.validateProjectAndTag(session, userId);
		calculator.calculateRest(session, session.getRatio());
		validator.validateSessions(session, errors);

		session.setUserId(userId);
		return sessionRepository.save(session);
	}

	public PageResponse<DailySessionsDTO> consult(int page, int size, String userId) {
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));

		Page<LocalDate> datePage = sessionRepository.findDistinctDates(userId, pageable);

		if (datePage.isEmpty()) {
			return new PageResponse<>(List.of(), page, size, 0, 0);
		}

		List<SessionModel> sessions = sessionRepository.findByUserIdAndDateInOrderByIdDesc(userId,
				datePage.getContent());

		List<DailySessionsDTO> dailySessions = aggregator.groupSessionsByDate(sessions, datePage.getContent());

		return new PageResponse<>(dailySessions, datePage.getNumber() + 1, datePage.getSize(),
				datePage.getTotalElements(), datePage.getTotalPages());
	}

	@Transactional
	public SessionModel update(Long id, SessionUpdateDTO dto, String userId) {
		SessionModel session = sessionRepository.findById(id)
				.orElseThrow(() -> new InvalidSessionException(SESSION_NOT_FOUND, "Session not found with id: " + id));

		if (!session.getUserId().equals(userId)) {
			throw new InvalidSessionException(SESSION_NOT_FOUND, "Session not found for this user");
		}

		sessionUpdateMapper.apply(session, dto);

		projectTagValidator.validateProjectAndTag(session, userId);

		List<String> errors = new ArrayList<>();
		validator.validateSessions(session, errors);

		return sessionRepository.save(session);
	}

	@Transactional
	public void delete(Long id, String userId) {
		SessionModel session = sessionRepository.findById(id)
				.orElseThrow(() -> new InvalidSessionException(SESSION_NOT_FOUND, "Session not found with id: " + id));

		if (!session.getUserId().equals(userId)) {
			throw new InvalidSessionException(SESSION_NOT_FOUND, "Session not found for this user");
		}

		sessionRepository.deleteById(id);
	}

}
