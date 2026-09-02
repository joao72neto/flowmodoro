package com.company.flowmodoro.features.backup;

import com.company.flowmodoro.features.backup.dtos.BackupImportDTO;
import com.company.flowmodoro.features.backup.dtos.BackupSessionDTO;
import com.company.flowmodoro.features.backup.enums.BackupErrorCode;
import com.company.flowmodoro.features.backup.exceptions.InvalidBackupException;
import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectRepository;
import com.company.flowmodoro.features.projects.dtos.ProjectDTO;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.SessionRepository;
import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.TagRepository;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BackupService {

    private final ProjectRepository projectRepository;
    private final TagRepository tagRepository;
    private final SessionRepository sessionRepository;

    public BackupService(
        ProjectRepository projectRepository,
        TagRepository tagRepository,
        SessionRepository sessionRepository
    ) {
        this.projectRepository = projectRepository;
        this.tagRepository = tagRepository;
        this.sessionRepository = sessionRepository;
    }

    @Transactional
    public void importBackup(BackupImportDTO dto, UUID authUserId) {
        if (!authUserId.equals(dto.getUserId())) {
            throw new InvalidBackupException(
                BackupErrorCode.USER_MISMATCH,
                "O userId do backup não corresponde ao usuário autenticado"
            );
        }

        // 1. Carregar IDs existentes no banco para o usuário
        Set<UUID> existingProjectIds = projectRepository
            .findByUserId(authUserId)
            .stream()
            .map(ProjectModel::getId)
            .collect(Collectors.toSet());
        Set<UUID> existingTagIds = tagRepository
            .findByUserId(authUserId)
            .stream()
            .map(TagModel::getId)
            .collect(Collectors.toSet());

        // Projetos e tags presentes no payload de importação
        Set<UUID> payloadProjectIds =
            dto.getProjects() != null
                ? dto
                      .getProjects()
                      .stream()
                      .map(ProjectDTO::getId)
                      .filter(Objects::nonNull)
                      .collect(Collectors.toSet())
                : Collections.emptySet();

        Set<UUID> payloadTagIds =
            dto.getTags() != null
                ? dto
                      .getTags()
                      .stream()
                      .map(TagDTO::getId)
                      .filter(Objects::nonNull)
                      .collect(Collectors.toSet())
                : Collections.emptySet();

        Set<UUID> validProjectIds = new HashSet<>(existingProjectIds);
        validProjectIds.addAll(payloadProjectIds);

        Set<UUID> validTagIds = new HashSet<>(existingTagIds);
        validTagIds.addAll(payloadTagIds);

        List<String> orphanErrors = new ArrayList<>();

        // 2. Validar órfãos nas Tags
        if (dto.getTags() != null) {
            for (var tagDto : dto.getTags()) {
                if (
                    tagDto.getProjectId() != null &&
                    !validProjectIds.contains(tagDto.getProjectId())
                ) {
                    orphanErrors.add(
                        "Tag '" +
                            tagDto.getName() +
                            "' (ID: " +
                            tagDto.getId() +
                            ") referencia projectId inexistente: " +
                            tagDto.getProjectId()
                    );
                }
            }
        }

        // 3. Validar órfãos nas Sessões
        if (dto.getSessions() != null) {
            for (var sessionDto : dto.getSessions()) {
                if (
                    sessionDto.getProjectId() != null &&
                    !validProjectIds.contains(sessionDto.getProjectId())
                ) {
                    orphanErrors.add(
                        "Sessão '" +
                            sessionDto.getName() +
                            "' (ID: " +
                            sessionDto.getId() +
                            ") referencia projectId inexistente: " +
                            sessionDto.getProjectId()
                    );
                }
                if (
                    sessionDto.getTagId() != null &&
                    !validTagIds.contains(sessionDto.getTagId())
                ) {
                    orphanErrors.add(
                        "Sessão '" +
                            sessionDto.getName() +
                            "' (ID: " +
                            sessionDto.getId() +
                            ") referencia tagId inexistente: " +
                            sessionDto.getTagId()
                    );
                }
            }
        }

        if (!orphanErrors.isEmpty()) {
            throw new InvalidBackupException(
                BackupErrorCode.ORPHAN_ENTITIES,
                orphanErrors
            );
        }

        // 4. Persistence / Upsert com "mais recente vence" (updatedAt)
        if (dto.getProjects() != null) {
            upsertProjects(dto.getProjects(), authUserId);
        }
        if (dto.getTags() != null) {
            upsertTags(dto.getTags(), authUserId);
        }
        if (dto.getSessions() != null) {
            upsertSessions(dto.getSessions(), authUserId);
        }
    }

    private void upsertProjects(List<ProjectDTO> dtos, UUID userId) {
        for (ProjectDTO dto : dtos) {
            Optional<ProjectModel> existingOpt =
                projectRepository.findByIdAndUserId(dto.getId(), userId);
            if (existingOpt.isPresent()) {
                ProjectModel existing = existingOpt.get();
                if (
                    dto.getUpdatedAt() == null ||
                    existing.getUpdatedAt() == null ||
                    !dto.getUpdatedAt().isBefore(existing.getUpdatedAt()) ||
                    existing.getDeletedAt() != null
                ) {
                    existing.setName(dto.getName());
                    existing.setColor(dto.getColor());
                    existing.setUpdatedAt(dto.getUpdatedAt());
                    existing.setDeletedAt(dto.getDeletedAt());
                    projectRepository.save(existing);
                }
            } else {
                ProjectModel model = ProjectModel.builder()
                    .id(dto.getId())
                    .name(dto.getName())
                    .color(dto.getColor())
                    .userId(userId)
                    .updatedAt(dto.getUpdatedAt())
                    .deletedAt(dto.getDeletedAt())
                    .build();
                projectRepository.save(model);
            }
        }
    }

    private void upsertTags(List<TagDTO> dtos, UUID userId) {
        for (TagDTO dto : dtos) {
            Optional<TagModel> existingOpt = tagRepository.findByIdAndUserId(
                dto.getId(),
                userId
            );
            ProjectModel project =
                dto.getProjectId() != null
                    ? projectRepository
                          .findById(dto.getProjectId())
                          .orElse(null)
                    : null;

            if (existingOpt.isPresent()) {
                TagModel existing = existingOpt.get();
                if (
                    dto.getUpdatedAt() == null ||
                    existing.getUpdatedAt() == null ||
                    !dto.getUpdatedAt().isBefore(existing.getUpdatedAt()) ||
                    existing.getDeletedAt() != null
                ) {
                    existing.setName(dto.getName());
                    existing.setProject(project);
                    existing.setUpdatedAt(dto.getUpdatedAt());
                    existing.setDeletedAt(dto.getDeletedAt());
                    tagRepository.save(existing);
                }
            } else {
                TagModel model = TagModel.builder()
                    .id(dto.getId())
                    .name(dto.getName())
                    .project(project)
                    .updatedAt(dto.getUpdatedAt())
                    .deletedAt(dto.getDeletedAt())
                    .build();
                tagRepository.save(model);
            }
        }
    }

    private void upsertSessions(List<BackupSessionDTO> dtos, UUID userId) {
        for (BackupSessionDTO dto : dtos) {
            Optional<SessionModel> existingOpt =
                sessionRepository.findByIdAndUserId(dto.getId(), userId);
            ProjectModel project =
                dto.getProjectId() != null
                    ? projectRepository
                          .findById(dto.getProjectId())
                          .orElse(null)
                    : null;
            TagModel tag =
                dto.getTagId() != null
                    ? tagRepository.findById(dto.getTagId()).orElse(null)
                    : null;

            if (existingOpt.isPresent()) {
                SessionModel existing = existingOpt.get();
                if (
                    dto.getUpdatedAt() == null ||
                    existing.getUpdatedAt() == null ||
                    !dto.getUpdatedAt().isBefore(existing.getUpdatedAt()) ||
                    existing.getDeletedAt() != null
                ) {
                    existing.setName(dto.getName());
                    existing.setFocus(dto.getFocus());
                    existing.setRatio(dto.getRatio());
                    existing.setRest(dto.getRest());
                    existing.setDate(dto.getDate());
                    existing.setProject(project);
                    existing.setTag(tag);
                    existing.setUpdatedAt(dto.getUpdatedAt());
                    existing.setDeletedAt(dto.getDeletedAt());
                    sessionRepository.save(existing);
                }
            } else {
                SessionModel model = SessionModel.builder()
                    .id(dto.getId())
                    .name(dto.getName())
                    .focus(dto.getFocus())
                    .ratio(dto.getRatio())
                    .rest(dto.getRest())
                    .date(dto.getDate())
                    .userId(userId)
                    .project(project)
                    .tag(tag)
                    .updatedAt(dto.getUpdatedAt())
                    .deletedAt(dto.getDeletedAt())
                    .build();
                sessionRepository.save(model);
            }
        }
    }
}
