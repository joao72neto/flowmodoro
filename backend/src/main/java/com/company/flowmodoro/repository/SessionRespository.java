package com.company.flowmodoro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.flowmodoro.model.entity.Session;

@Repository
public interface SessionRespository extends JpaRepository<Session, Long> {}
