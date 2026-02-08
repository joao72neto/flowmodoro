package com.company.flowmodoro.task.mapper;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.task.dto.TaskStatusDTO;
import com.company.flowmodoro.task.model.Task;

@Component
public class TaskStatusMapper {

  public Task toEntity(TaskStatusDTO taskStatusDTO) {
    return Task.builder()
        .checked(taskStatusDTO.getChecked())
        .build();
  }

  public TaskStatusDTO toDTO(Task task) {
    return TaskStatusDTO.builder()
        .checked(task.getChecked())
        .build();
  }
}
