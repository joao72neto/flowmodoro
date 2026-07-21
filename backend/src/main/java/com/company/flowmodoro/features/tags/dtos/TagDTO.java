package com.company.flowmodoro.features.tags.dtos;

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
public class TagDTO {

    private UUID id;

    @NotBlank(message = "Tag name is required")
    private String name;

    private UUID projectId;

    private Long totalFocus;
}
