package com.company.flowmodoro.features.sessions.dtos;

import com.company.flowmodoro.features.projects.dtos.ProjectDTO;
import com.company.flowmodoro.features.tags.dtos.TagSessionDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {

    private UUID id;

    @NotBlank(message = "Session name is required")
    private String name;

    @NotNull(message = "Session focus time is required")
    private Long focus;

    private Double ratio;

    private Long rest;

    private ProjectDTO project;

    private TagSessionDTO tag;
}
