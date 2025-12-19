package com.company.flowmodoro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.flowmodoro.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
