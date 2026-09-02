package com.company.flowmodoro.features.backup.dtos;

import com.company.flowmodoro.features.projects.dtos.ProjectDTO;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
public class BackupImportDTO {

    @NotNull(message = "userId é obrigatório")
    private UUID userId;

    private Integer version;

    private String exportedAt;

    @Valid
    @NotNull
    private List<ProjectDTO> projects;

    @Valid
    @NotNull
    private List<TagDTO> tags;

    @Valid
    @NotNull
    private List<BackupSessionDTO> sessions;
}
