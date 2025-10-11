package com.company.flowmodoro.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SessionDTO {
    private String task;
    private Double focus;
    private Double rest;
    private Integer interruptions;
}
