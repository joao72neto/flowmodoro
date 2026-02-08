package com.company.flowmodoro.task.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.task.dtos.TaskDTO;
import com.company.flowmodoro.task.model.Task;

@Component
public class TaskMapper {
  public Task toEntity(TaskDTO taskDTO) {
    return Task.builder()
        .id(taskDTO.getId())
        .name(taskDTO.getName())
        .checked(taskDTO.getChecked())
        .build();
  }

  public TaskDTO toDTO(Task task) {
    return TaskDTO.builder()
        .id(task.getId())
        .name(task.getName())
        .checked(task.getChecked())
        .build();
  }

  public List<TaskDTO> toDTO(List<Task> tasks) {
    return tasks.stream().map(this::toDTO).toList();
  }
}
