package com.company.flowmodoro.mapper.tasks;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.dto.tasks.TaskStatusDTO;
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
