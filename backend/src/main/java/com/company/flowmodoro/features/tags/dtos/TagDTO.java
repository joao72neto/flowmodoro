package com.company.flowmodoro.features.tags.dtos;

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
public class TagDTO {

    private UUID id;

    @NotBlank(message = "Tag name is required")
    private String name;

    private UUID projectId;

    private Long totalFocus;

    private OffsetDateTime updatedAt;

    private OffsetDateTime deletedAt;

    public TagDTO(UUID id, String name, UUID projectId, Long totalFocus) {
        this.id = id;
        this.name = name;
        this.projectId = projectId;
        this.totalFocus = totalFocus;
    }
}
