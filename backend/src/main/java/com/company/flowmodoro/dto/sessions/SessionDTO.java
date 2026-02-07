package com.company.flowmodoro.dto.sessions;

import com.company.flowmodoro.dto.tasks.TaskDTO;

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
    private Double focus;
    private Double ratio;
    private Double rest;
    private Integer interruptions;
    private TaskDTO task;
}