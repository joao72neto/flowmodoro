package com.company.flowmodoro.task.exceptions;

import java.util.List;

import com.company.flowmodoro.shared.exception.BaseException;
import com.company.flowmodoro.task.enums.TaskErrorCode;

public class InvalidTaskException extends BaseException {
  public InvalidTaskException(TaskErrorCode code, String error) {
    super(code, error);
  }

  public InvalidTaskException(TaskErrorCode code, List<String> error) {
    super(code, error);
  }
}
