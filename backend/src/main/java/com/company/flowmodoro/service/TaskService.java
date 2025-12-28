package com.company.flowmodoro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.flowmodoro.model.Task;
import com.company.flowmodoro.repository.TaskRepository;

@Service
public class TaskService {

  @Autowired
  private TaskRepository taskRepository;

  public List<Task> consult() {
    return taskRepository.findAll();
  }

  public Task save(Task task) {
    taskRepository.save(task);
    return task;
  }

  public Task delete(Task task) {
    taskRepository.deleteById(task.getId());
    return task;
  }

  public Task update(Task task) {
    taskRepository.save(task);
    return task;
  }

}
