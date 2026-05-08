package com.company.flowmodoro.features.task;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.flowmodoro.features.task.enums.TaskErrorCode;
import com.company.flowmodoro.features.task.exceptions.InvalidTaskException;
import com.company.flowmodoro.features.task.helpers.TaskValidator;

@Service
public class TaskService {

	private static final TaskErrorCode TASK_NOT_FOUND = TaskErrorCode.TASK_NOT_FOUND;

	private final TaskRepository taskRepository;

	private final TaskValidator taskValidator;

	public TaskService(TaskRepository taskRepository, TaskValidator taskValidator) {
		this.taskRepository = taskRepository;
		this.taskValidator = taskValidator;
	}

	public List<TaskModel> consult(String userId) {
		return taskRepository.findAllByUserIdOrderByIdDesc(userId);
	}

	public TaskModel save(TaskModel task, String userId) {
		List<String> errors = new ArrayList<>();
		taskValidator.validateTask(task, errors);

		task.setUserId(userId);
		return taskRepository.save(task);
	}

	@Transactional
	public void deleteById(Long id, String userId) {
		TaskModel taskToDelete = taskRepository.findById(id)
			.orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to delete"));

		if (!taskToDelete.getUserId().equals(userId)) {
			throw new InvalidTaskException(TASK_NOT_FOUND, "You don't have permission to delete this task");
		}

		taskRepository.delete(taskToDelete);
	}

	@Transactional
	public TaskModel updateStatus(Long id, TaskModel task, String userId) {
		TaskModel taskToUpdate = taskRepository.findById(id)
			.orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to update status"));

		if (!taskToUpdate.getUserId().equals(userId)) {
			throw new InvalidTaskException(TASK_NOT_FOUND, "You don't have permission to update this task");
		}

		List<String> errors = new ArrayList<>();
		taskValidator.validateStatusUpdate(task, errors);

		taskToUpdate.setChecked(task.getChecked());

		return taskToUpdate;
	}

	@Transactional
	public TaskModel update(Long id, TaskModel task, String userId) {
		TaskModel taskToUpdate = taskRepository.findById(id)
			.orElseThrow(() -> new InvalidTaskException(TASK_NOT_FOUND, "Task not found to update"));

		if (!taskToUpdate.getUserId().equals(userId)) {
			throw new InvalidTaskException(TASK_NOT_FOUND, "You don't have permission to update this task");
		}

		taskToUpdate.setName(task.getName());
		if (task.getChecked() != null) {
			taskToUpdate.setChecked(task.getChecked());
		}

		List<String> errors = new ArrayList<>();
		taskValidator.validateTask(taskToUpdate, errors);

		return taskToUpdate;
	}

}
