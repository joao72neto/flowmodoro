package com.company.flowmodoro.features.session;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRespository extends JpaRepository<SessionModel, Long> {

  @Query(value = "SELECT DISTINCT s.date FROM SessionModel s", countQuery = "SELECT COUNT(DISTINCT s.date) FROM SessionModel s")
  Page<LocalDate> findDistinctDates(Pageable pageable);

  List<SessionModel> findByDateInOrderByIdDesc(List<LocalDate> dates);

  Optional<SessionModel> findByTaskIdAndDate(Long taskId, LocalDate date);
}
