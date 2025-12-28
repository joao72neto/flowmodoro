package com.company.flowmodoro.dto;

import java.util.List;

import com.company.flowmodoro.enums.ErrorCode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private ErrorCode code;
    private List<String> errors;
}
