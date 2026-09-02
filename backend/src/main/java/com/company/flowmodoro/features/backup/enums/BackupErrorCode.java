package com.company.flowmodoro.features.backup.enums;

import com.company.flowmodoro.exception.ErrorResponse.ErrorCode;

public enum BackupErrorCode implements ErrorCode {
    INVALID_BACKUP,
    USER_MISMATCH,
    ORPHAN_ENTITIES,
}
