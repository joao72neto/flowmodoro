package com.company.flowmodoro.task;

import java.util.List;

import org.springframework.stereotype.Service;

import com.company.flowmodoro.task.enums.TaskErrorCode;
import com.company.flowmodoro.task.exceptions.InvalidTaskException;

import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

  private static final TaskErrorCode TASK_NOT_FOUND = TaskErrorCode.TASK_NOT_FOUND;
  private final TaskRepository taskRepository;

  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  public List<TaskModel> consult() {
    return taskRepository.findAllByOrderByIdDesc();
  }

  public TaskModel save(TaskModel task) {
    return taskRepository.save(task);
  }

  @Transactional
  public void deleteById(Long id) {
    TaskModel taskToDelete = taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to delete"));

    taskRepository.delete(taskToDelete);
  }

  @Transactional
  public TaskModel updateStatus(Long id, TaskModel task) {
    TaskModel taskToUpdate = taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to update status"));

    taskToUpdate.setChecked(task.getChecked());

    return taskToUpdate;
  }

  @Transactional
  public TaskModel update(Long id, TaskModel task) {
    TaskModel taskToUpdate = taskRepository.findById(id)
        .orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to update"));

    taskToUpdate.setName(task.getName());
    taskToUpdate.setChecked(task.getChecked());

    return taskToUpdate;
  }
}
