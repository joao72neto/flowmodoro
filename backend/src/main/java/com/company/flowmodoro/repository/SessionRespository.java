package com.company.flowmodoro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.flowmodoro.model.Session;

@Repository
public interface SessionRespository extends JpaRepository<Session, Long> {
  List<Session> findAllByOrderByIdDesc();
}
