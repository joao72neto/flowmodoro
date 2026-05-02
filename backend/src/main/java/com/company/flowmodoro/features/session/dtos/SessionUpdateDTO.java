package com.company.flowmodoro.features.session.dtos;

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

	private Double ratio;

	private Long rest;

	private Integer interruptions;

	private Long task;

}
