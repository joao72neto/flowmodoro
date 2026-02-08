package com.company.flowmodoro.features.task.exceptions;

import java.util.List;

import com.company.flowmodoro.features.task.enums.TaskErrorCode;
import com.company.flowmodoro.shared.exception.BaseException;

public class InvalidTaskException extends BaseException {
  public InvalidTaskException(TaskErrorCode code, String error) {
    super(code, error);
  }

  public InvalidTaskException(TaskErrorCode code, List<String> error) {
    super(code, error);
  }
}
