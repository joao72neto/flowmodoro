package com.company.flowmodoro.features.projects.dtos;

import jakarta.validation.constraints.NotBlank;
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
public class ProjectDTO {

    private UUID id;

    @NotBlank(message = "Project name is required")
    private String name;

    private Long totalFocus;

    private String color;

    private OffsetDateTime updatedAt;

    private OffsetDateTime deletedAt;

    public ProjectDTO(UUID id, String name, Long totalFocus, String color) {
        this.id = id;
        this.name = name;
        this.totalFocus = totalFocus;
        this.color = color;
    }
}
