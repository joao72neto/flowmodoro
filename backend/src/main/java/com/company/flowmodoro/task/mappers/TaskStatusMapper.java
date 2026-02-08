package com.company.flowmodoro.task.mappers;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.task.TaskModel;
import com.company.flowmodoro.task.dtos.TaskStatusDTO;

@Component
public class TaskStatusMapper {

  public TaskModel toEntity(TaskStatusDTO taskStatusDTO) {
    return TaskModel.builder()
        .checked(taskStatusDTO.getChecked())
        .build();
  }

  public TaskStatusDTO toDTO(TaskModel task) {
    return TaskStatusDTO.builder()
        .checked(task.getChecked())
        .build();
  }
}
