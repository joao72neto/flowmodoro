package com.company.flowmodoro.features.sessions.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionCreateDTO {

    private UUID id;

    @NotBlank(message = "Session name is required")
    private String name;

    @NotNull(message = "Session focus time is required")
    private Long focus;

    private Double ratio;

    private Long rest;

    private UUID projectId;

    private UUID tagId;

    private OffsetDateTime date;
}
