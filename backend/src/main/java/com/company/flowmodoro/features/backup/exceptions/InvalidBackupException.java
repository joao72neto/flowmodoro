package com.company.flowmodoro.features.backup.exceptions;

import com.company.flowmodoro.exception.BaseException;
import com.company.flowmodoro.exception.ErrorResponse.ErrorCode;
import java.util.List;

public class InvalidBackupException extends BaseException {

    public InvalidBackupException(ErrorCode code, String message) {
        super(code, message);
    }

    public InvalidBackupException(ErrorCode code, List<String> errors) {
        super(code, errors);
    }
}
