package com.company.flowmodoro.dto.sessions;

import java.time.LocalDate;

import com.company.flowmodoro.dto.TaskDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    private Double focus;
    private Double ratio;
    private Double rest;
    private Integer interruptions;
    private TaskDTO task;
}