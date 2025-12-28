package com.company.flowmodoro.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.company.flowmodoro.exception.InvalidTaskException;
import com.company.flowmodoro.model.Task;
import com.company.flowmodoro.repository.TaskRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

  private final TaskRepository taskRepository;

  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  public List<Task> consult() {
    return taskRepository.findAll();
  }

  public Task findById(Long id) {
    return taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException("Task not found"));
  }

  public Task save(Task task) {
    return taskRepository.save(task);
  }

  @Transactional
  public void deleteById(Long id) {
    Task taskToDelete = taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException("Task not found to delete"));

    taskRepository.delete(taskToDelete);
  }

  @Transactional
  public Task updateStatus(Long id, Task task) {
    Task taskToUpdate = taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException("Task not found to update status"));

    taskToUpdate.setChecked(task.getChecked());

    return taskToUpdate;
  }
}
