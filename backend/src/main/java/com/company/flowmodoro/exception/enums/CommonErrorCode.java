package com.company.flowmodoro.exception.enums;

import com.company.flowmodoro.exception.ErrorResponse.ErrorCode;

public enum CommonErrorCode implements ErrorCode {
    VALIDATION_ERROR,
    RATE_LIMIT_EXCEEDED,
    UNAUTHORIZED,
    ACCESS_DENIED,
}
