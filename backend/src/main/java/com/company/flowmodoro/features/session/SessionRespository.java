package com.company.flowmodoro.features.session;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRespository extends JpaRepository<SessionModel, Long> {

	@Query(value = "SELECT DISTINCT s.date FROM SessionModel s WHERE s.userId = :userId", countQuery = "SELECT COUNT(DISTINCT s.date) FROM SessionModel s WHERE s.userId = :userId")
	Page<LocalDate> findDistinctDates(String userId, Pageable pageable);

	List<SessionModel> findByUserIdAndDateInOrderByIdDesc(String userId, List<LocalDate> dates);

}
