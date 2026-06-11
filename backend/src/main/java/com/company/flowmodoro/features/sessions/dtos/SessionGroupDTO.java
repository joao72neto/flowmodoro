package com.company.flowmodoro.features.sessions.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionGroupDTO {

	private String name;

	private long totalFocus;

	private long totalRest;

	private List<SessionDTO> sessions;

}
