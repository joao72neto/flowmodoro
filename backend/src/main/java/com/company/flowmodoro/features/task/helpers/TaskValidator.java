package com.company.flowmodoro.features.task.helpers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.task.TaskModel;
import com.company.flowmodoro.features.task.enums.TaskErrorCode;
import com.company.flowmodoro.features.task.exceptions.InvalidTaskException;

@Component
public class TaskValidator {

	public void validateTask(TaskModel task, List<String> errors) {

		if (task.getName() == null || task.getName().isBlank()) {
			errors.add("Task name is required");
			throw new InvalidTaskException(TaskErrorCode.INVALID_TASK_NAME, errors);
		}

		if (task.getChecked() == null) {
			errors.add("Task checked status is required");
			throw new InvalidTaskException(TaskErrorCode.INVALID_TASK_CHECKED_STATUS, errors);
		}

		if (task.getChecked() == true) {
			errors.add("Task name can't be checked");
			throw new InvalidTaskException(TaskErrorCode.INVALID_TASK_CHECKED_STATUS, errors);
		}
	}
}
