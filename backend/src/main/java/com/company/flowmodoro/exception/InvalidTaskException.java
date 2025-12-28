package com.company.flowmodoro.exception;

import java.util.List;

public class InvalidTaskException extends RuntimeException {
  private final List<String> errors;

  public InvalidTaskException(String error) {
    super(error);
    this.errors = List.of(error);
  }

  public InvalidTaskException(List<String> errors) {
    super(String.join(", ", errors));
    this.errors = errors;
  }

  public List<String> getErrors() {
    return errors;
  }
}
