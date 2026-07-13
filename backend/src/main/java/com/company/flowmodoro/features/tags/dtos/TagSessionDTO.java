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
public class TagSessionDTO {

    private UUID id;

    @NotBlank(message = "Tag name is required")
    private String name;
}
