package com.company.flowmodoro.features.session.dtos;

import com.company.flowmodoro.features.task.dtos.TaskDTO;

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
    private Long focus;
    private Double ratio;
    private Long rest;
    private Integer interruptions;
    private TaskDTO task;
}