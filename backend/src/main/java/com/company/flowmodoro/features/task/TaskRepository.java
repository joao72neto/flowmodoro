package com.company.flowmodoro.features.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<TaskModel, Long> {
  List<TaskModel> findAllByUserIdOrderByIdDesc(String userId);
}
