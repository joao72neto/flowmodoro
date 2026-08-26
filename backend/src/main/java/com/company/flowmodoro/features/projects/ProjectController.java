package com.company.flowmodoro.features.projects;

import com.company.flowmodoro.configs.security.CurrentUser;
import com.company.flowmodoro.features.projects.dtos.ProjectDTO;
import com.company.flowmodoro.features.projects.dtos.ProjectPayloadDTO;
import com.company.flowmodoro.features.projects.dtos.ProjectUpdateDTO;
import com.company.flowmodoro.features.projects.mappers.ProjectMapper;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    private final ProjectMapper projectMapper;

    public ProjectController(
        ProjectService projectService,
        ProjectMapper projectMapper
    ) {
        this.projectService = projectService;
        this.projectMapper = projectMapper;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> findAll(
        @CurrentUser UUID userId
    ) {
        List<ProjectDTO> projects = projectService.findAll(userId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> findById(
        @PathVariable UUID id,
        @CurrentUser UUID userId
    ) {
        ProjectModel project = projectService.findById(id, userId);
        return ResponseEntity.ok(projectMapper.toDTO(project));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<ProjectDTO>> saveAll(
        @Valid @RequestBody List<ProjectDTO> dtos,
        @CurrentUser UUID userId
    ) {
        List<ProjectModel> entities = projectMapper.toEntity(dtos);
        List<ProjectModel> saved = projectService.saveAll(entities, userId);
        return ResponseEntity.status(201).body(projectMapper.toDTO(saved));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> save(
        @Valid @RequestBody ProjectDTO dto,
        @CurrentUser UUID userId
    ) {
        ProjectModel project = projectService.save(
            projectMapper.toEntity(dto),
            userId
        );
        return ResponseEntity.status(201).body(projectMapper.toDTO(project));
    }

    @PutMapping("/bulk")
    public ResponseEntity<List<ProjectDTO>> updateAll(
        @Valid @RequestBody List<ProjectPayloadDTO> dtos,
        @CurrentUser UUID userId
    ) {
        List<ProjectModel> updated = projectService.updateAll(dtos, userId);
        return ResponseEntity.ok(projectMapper.toDTO(updated));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> update(
        @PathVariable UUID id,
        @Valid @RequestBody ProjectUpdateDTO dto,
        @CurrentUser UUID userId
    ) {
        ProjectModel project = projectService.update(id, dto, userId);
        return ResponseEntity.ok(projectMapper.toDTO(project));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteAll(
        @RequestBody List<UUID> ids,
        @CurrentUser UUID userId
    ) {
        projectService.deleteAll(ids, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable UUID id,
        @CurrentUser UUID userId
    ) {
        projectService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
