package com.company.flowmodoro.session.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionUpdateDTO {
  private Long id;
  private Double focus;
  private Double ratio;
  private Double rest;
  private Integer interruptions;
  private Long task;
}
