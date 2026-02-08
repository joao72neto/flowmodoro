package com.company.flowmodoro.task.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.company.flowmodoro.task.enums.TaskErrorCode;
import com.company.flowmodoro.task.exceptions.InvalidTaskException;
import com.company.flowmodoro.task.model.Task;
import com.company.flowmodoro.task.repository.TaskRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

  private static final TaskErrorCode TASK_NOT_FOUND = TaskErrorCode.TASK_NOT_FOUND;
  private final TaskRepository taskRepository;

  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  public List<Task> consult() {
    return taskRepository.findAllByOrderByIdDesc();
  }

  public Task save(Task task) {
    return taskRepository.save(task);
  }

  @Transactional
  public void deleteById(Long id) {
    Task taskToDelete = taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to delete"));

    taskRepository.delete(taskToDelete);
  }

  @Transactional
  public Task updateStatus(Long id, Task task) {
    Task taskToUpdate = taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to update status"));

    taskToUpdate.setChecked(task.getChecked());

    return taskToUpdate;
  }

  @Transactional
  public Task update(Long id, Task task) {
    Task taskToUpdate = taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to update"));

    taskToUpdate.setName(task.getName());
    taskToUpdate.setChecked(task.getChecked());

    return taskToUpdate;
  }
}
