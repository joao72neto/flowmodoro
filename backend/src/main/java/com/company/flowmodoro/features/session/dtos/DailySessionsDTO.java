package com.company.flowmodoro.features.session.dtos;

import java.time.LocalDate;
import java.util.List;

import com.company.flowmodoro.features.task.dtos.TaskGroupDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailySessionsDTO {
  private LocalDate date;
  private Long totalFocus;
  private Long totalRest;
  private List<TaskGroupDTO> taskGroups;
}
