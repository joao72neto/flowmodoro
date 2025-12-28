package com.company.flowmodoro.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.dto.TaskDTO;
import com.company.flowmodoro.model.Task;

@Component
public class TaskMapper {
  public Task toEntity(TaskDTO taskDTO) {
    return Task.builder()
        .name(taskDTO.getName())
        .checked(taskDTO.getChecked())
        .build();
  }

  public TaskDTO toDTO(Task task) {
    return TaskDTO.builder()
        .name(task.getName())
        .checked(task.getChecked())
        .build();
  }

  public List<TaskDTO> toDTO(List<Task> tasks) {
    return tasks.stream().map(this::toDTO).toList();
  }
}
