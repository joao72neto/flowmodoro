package com.company.flowmodoro.features.session.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {

	private Long id;

	private String name;

	@NotNull(message = "Session focus time is required")
	private Long focus;

	private Double ratio;

	private Long rest;

	private Integer interruptions;

}