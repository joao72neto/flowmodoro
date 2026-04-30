package com.company.flowmodoro.features.task.dtos;

import lombok.Builder;
import lombok.Data;
import java.util.List;

import com.company.flowmodoro.features.session.dtos.SessionDTO;

@Data
@Builder
public class TaskGroupDTO {
  private TaskDTO task;
  private long taskTotalFocus;
  private long taskTotalRest;
  private List<SessionDTO> sessions;
}
