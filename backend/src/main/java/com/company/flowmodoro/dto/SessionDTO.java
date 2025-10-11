package com.company.flowmodoro.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    private String task;
    private Double focus;
    private Double ratio;
    private Double rest;
    private Integer interruptions;
    private Date date;
}