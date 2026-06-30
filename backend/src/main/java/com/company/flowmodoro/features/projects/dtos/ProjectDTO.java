package com.company.flowmodoro.features.projects.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

	private Long id;

	@NotBlank(message = "Project name is required")
	private String name;

	private Long totalFocus;

}
