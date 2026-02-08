package com.company.flowmodoro.features.task.mappers;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.task.TaskModel;
import com.company.flowmodoro.features.task.dtos.TaskUpdateDTO;

@Component
public class TaskUpdateMapper {
  public TaskModel toEntity(TaskUpdateDTO taskUpdateDTO) {
    return TaskModel.builder()
        .name(taskUpdateDTO.getName())
        .checked(taskUpdateDTO.getChecked())
        .build();
  }

  public TaskUpdateDTO toDTO(TaskModel task) {
    return TaskUpdateDTO.builder()
        .name(task.getName())
        .checked(task.getChecked())
        .build();
  }
}
