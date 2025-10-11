package com.company.flowmodoro.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.company.flowmodoro.dto.ErrorResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidSessionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidSession(InvalidSessionException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Invalid Session")
                .error(ex.getMessage())
                .build();
                
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
