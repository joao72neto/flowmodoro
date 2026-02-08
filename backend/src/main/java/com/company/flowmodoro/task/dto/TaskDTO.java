package com.company.flowmodoro.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
  private Long id;
  private String name;
  private Boolean checked;
}
