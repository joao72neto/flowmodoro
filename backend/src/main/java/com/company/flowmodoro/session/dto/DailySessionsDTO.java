package com.company.flowmodoro.session.dto;

import java.time.LocalDate;
import java.util.List;

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
  private Double totalFocus;
  private Double totalRest;
  private List<SessionDTO> sessions;
}
