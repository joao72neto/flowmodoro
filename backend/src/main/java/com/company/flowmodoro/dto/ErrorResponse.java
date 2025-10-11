package com.company.flowmodoro.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorResponse {
    private String message;
    private List<String> errors;
}
