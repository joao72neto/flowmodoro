package com.company.flowmodoro.features.task.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.task.TaskModel;
import com.company.flowmodoro.features.task.dtos.TaskDTO;

@Component
public class TaskMapper {

	public TaskModel toEntity(TaskDTO taskDTO) {
		return TaskModel.builder().id(taskDTO.getId()).name(taskDTO.getName()).checked(taskDTO.getChecked()).build();
	}

	public TaskDTO toDTO(TaskModel task) {
		if (task == null) {
			return null;
		}
		return TaskDTO.builder().id(task.getId()).name(task.getName()).checked(task.getChecked()).build();
	}

	public List<TaskDTO> toDTO(List<TaskModel> tasks) {
		return tasks.stream().map(this::toDTO).toList();
	}

}
