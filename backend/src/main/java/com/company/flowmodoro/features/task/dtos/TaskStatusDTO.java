package com.company.flowmodoro.features.task.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusDTO {

	@NotNull(message = "Task checked status is required")
	private Boolean checked;

}
