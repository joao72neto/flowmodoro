package com.company.flowmodoro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.flowmodoro.model.Task;
import com.company.flowmodoro.repository.TaskRepository;

@Service
public class TaskService {

  @Autowired
  private TaskRepository taskRepository;

  public Task save(Task task) {
    taskRepository.save(task);
    return task;
  }

}
