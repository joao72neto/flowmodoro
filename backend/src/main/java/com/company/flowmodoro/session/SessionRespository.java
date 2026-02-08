package com.company.flowmodoro.session;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRespository extends JpaRepository<SessionModel, Long> {
  List<SessionModel> findAllByOrderByIdDesc();

  Optional<SessionModel> findByTaskIdAndDate(Long taskId, LocalDate date);
}
