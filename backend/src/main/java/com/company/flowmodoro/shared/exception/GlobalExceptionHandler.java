package com.company.flowmodoro.shared.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BaseException.class)
	public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex) {
		ErrorResponse errorResponse = ErrorResponse.builder().code(ex.getCode()).errors(ex.getErrors()).build();

		return ResponseEntity.badRequest().body(errorResponse);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
		List<String> errors = ex.getBindingResult()
			.getFieldErrors()
			.stream()
			.map(error -> error.getDefaultMessage())
			.collect(Collectors.toList());

		ErrorResponse errorResponse = ErrorResponse.builder()
			.code(CommonErrorCode.VALIDATION_ERROR)
			.errors(errors)
			.build();

		return ResponseEntity.badRequest().body(errorResponse);
	}

}
