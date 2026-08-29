package com.company.flowmodoro.features.projects.dtos;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectPayloadDTO {

    private UUID id;

    @NotBlank(message = "Project name is required")
    private String name;

    private String color;
}
