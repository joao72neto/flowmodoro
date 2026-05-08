package com.company.flowmodoro.features.task.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

	private Long id;

	@NotBlank(message = "Task name is required")
	private String name;

	@NotNull(message = "Task checked is required")
	private Boolean checked;

}
