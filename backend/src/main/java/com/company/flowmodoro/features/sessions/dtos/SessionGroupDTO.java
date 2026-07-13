package com.company.flowmodoro.features.sessions.dtos;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionGroupDTO {

    private UUID id;

    private String name;

    private long totalFocus;

    private long totalRest;

    private List<SessionDTO> sessions;
}
