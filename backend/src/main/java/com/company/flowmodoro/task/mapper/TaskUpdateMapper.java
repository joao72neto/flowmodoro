package com.company.flowmodoro.task.mapper;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.task.dto.TaskUpdateDTO;
import com.company.flowmodoro.task.model.Task;

@Component
public class TaskUpdateMapper {
  public Task toEntity(TaskUpdateDTO taskUpdateDTO) {
    return Task.builder()
        .name(taskUpdateDTO.getName())
        .checked(taskUpdateDTO.getChecked())
        .build();
  }

  public TaskUpdateDTO toDTO(Task task) {
    return TaskUpdateDTO.builder()
        .name(task.getName())
        .checked(task.getChecked())
        .build();
  }
}
