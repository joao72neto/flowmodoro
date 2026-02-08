package com.company.flowmodoro.session.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.flowmodoro.session.model.Session;

@Repository
public interface SessionRespository extends JpaRepository<Session, Long> {
  List<Session> findAllByOrderByIdDesc();

  Optional<Session> findByTaskIdAndDate(Long taskId, LocalDate date);
}
