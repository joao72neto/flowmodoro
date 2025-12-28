package com.company.flowmodoro.mapper;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.dto.TaskStatusDTO;
import com.company.flowmodoro.model.Task;

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
