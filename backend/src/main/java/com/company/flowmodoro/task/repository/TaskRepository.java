package com.company.flowmodoro.task.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.flowmodoro.task.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
  List<Task> findAllByOrderByIdDesc();
}
