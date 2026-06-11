package com.company.flowmodoro.features.session.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionUpdateDTO {

	private Long id;

	private Long focus;

	@NotBlank(message = "Session name is required")
	private String name;

	private Double ratio;

	private Long rest;

}
