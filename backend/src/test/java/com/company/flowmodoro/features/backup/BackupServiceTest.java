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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BackupServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private BackupService backupService;

    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
    }

    @Test
    @DisplayName("Should throw USER_MISMATCH exception when backup userId does not match auth userId")
    void shouldThrowExceptionWhenUserMismatch() {
        UUID otherUserId = UUID.randomUUID();
        BackupImportDTO dto = BackupImportDTO.builder()
                .userId(otherUserId)
                .projects(Collections.emptyList())
                .tags(Collections.emptyList())
                .sessions(Collections.emptyList())
                .build();

        InvalidBackupException ex = assertThrows(
                InvalidBackupException.class,
                () -> backupService.importBackup(dto, userId)
        );

        assertThat(ex.getCode()).isEqualTo(BackupErrorCode.USER_MISMATCH);
    }

    @Test
    @DisplayName("Should throw ORPHAN_ENTITIES exception when a tag references a nonexistent project")
    void shouldThrowExceptionWhenTagHasOrphanProject() {
        UUID orphanProjectId = UUID.randomUUID();
        TagDTO tagDto = TagDTO.builder()
                .id(UUID.randomUUID())
                .name("Orphan Tag")
                .projectId(orphanProjectId)
                .build();

        BackupImportDTO dto = BackupImportDTO.builder()
                .userId(userId)
                .projects(Collections.emptyList())
                .tags(List.of(tagDto))
                .sessions(Collections.emptyList())
                .build();

        when(projectRepository.findByUserId(userId)).thenReturn(Collections.emptyList());
        when(tagRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        InvalidBackupException ex = assertThrows(
                InvalidBackupException.class,
                () -> backupService.importBackup(dto, userId)
        );

        assertThat(ex.getCode()).isEqualTo(BackupErrorCode.ORPHAN_ENTITIES);
        assertThat(ex.getErrors()).anyMatch(err -> err.contains(orphanProjectId.toString()));
    }

    @Test
    @DisplayName("Should throw ORPHAN_ENTITIES exception when a session references a nonexistent tag")
    void shouldThrowExceptionWhenSessionHasOrphanTag() {
        UUID orphanTagId = UUID.randomUUID();
        BackupSessionDTO sessionDto = BackupSessionDTO.builder()
                .id(UUID.randomUUID())
                .name("Session with orphan tag")
                .focus(1500L)
                .tagId(orphanTagId)
                .build();

        BackupImportDTO dto = BackupImportDTO.builder()
                .userId(userId)
                .projects(Collections.emptyList())
                .tags(Collections.emptyList())
                .sessions(List.of(sessionDto))
                .build();

        when(projectRepository.findByUserId(userId)).thenReturn(Collections.emptyList());
        when(tagRepository.findByUserId(userId)).thenReturn(Collections.emptyList());

        InvalidBackupException ex = assertThrows(
                InvalidBackupException.class,
                () -> backupService.importBackup(dto, userId)
        );

        assertThat(ex.getCode()).isEqualTo(BackupErrorCode.ORPHAN_ENTITIES);
        assertThat(ex.getErrors()).anyMatch(err -> err.contains(orphanTagId.toString()));
    }

    @Test
    @DisplayName("Should successfully import backup with new projects, tags, and sessions")
    void shouldSuccessfullyImportValidBackup() {
        UUID projectId = UUID.randomUUID();
        UUID tagId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        ProjectDTO projectDTO = ProjectDTO.builder()
                .id(projectId)
                .name("Flowmodoro")
                .color("#FF5733")
                .updatedAt(OffsetDateTime.now())
                .build();

        TagDTO tagDTO = TagDTO.builder()
                .id(tagId)
                .name("Development")
                .projectId(projectId)
                .updatedAt(OffsetDateTime.now())
                .build();

        BackupSessionDTO sessionDTO = BackupSessionDTO.builder()
                .id(sessionId)
                .name("Coding session")
                .focus(1500L)
                .ratio(0.2)
                .rest(300L)
                .date(LocalDate.now())
                .projectId(projectId)
                .tagId(tagId)
                .updatedAt(OffsetDateTime.now())
                .build();

        BackupImportDTO dto = BackupImportDTO.builder()
                .userId(userId)
                .projects(List.of(projectDTO))
                .tags(List.of(tagDTO))
                .sessions(List.of(sessionDTO))
                .build();

        when(projectRepository.findByUserId(userId)).thenReturn(Collections.emptyList());
        when(tagRepository.findByUserId(userId)).thenReturn(Collections.emptyList());
        when(projectRepository.findByIdAndUserId(projectId, userId)).thenReturn(Optional.empty());
        when(tagRepository.findByIdAndUserId(tagId, userId)).thenReturn(Optional.empty());
        when(sessionRepository.findByIdAndUserId(sessionId, userId)).thenReturn(Optional.empty());

        ProjectModel savedProject = ProjectModel.builder().id(projectId).name("Flowmodoro").build();
        TagModel savedTag = TagModel.builder().id(tagId).name("Development").build();
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(savedProject));
        when(tagRepository.findById(tagId)).thenReturn(Optional.of(savedTag));

        backupService.importBackup(dto, userId);

        verify(projectRepository, times(1)).save(any(ProjectModel.class));
        verify(tagRepository, times(1)).save(any(TagModel.class));
        verify(sessionRepository, times(1)).save(any(SessionModel.class));
    }

    @Test
    @DisplayName("Should upsert existing project when imported version is newer")
    void shouldUpsertExistingProjectWhenNewer() {
        UUID projectId = UUID.randomUUID();
        OffsetDateTime oldDate = OffsetDateTime.now().minusDays(2);
        OffsetDateTime newDate = OffsetDateTime.now();

        ProjectModel existing = ProjectModel.builder()
                .id(projectId)
                .name("Old Name")
                .userId(userId)
                .updatedAt(oldDate)
                .build();

        ProjectDTO importedDto = ProjectDTO.builder()
                .id(projectId)
                .name("New Name")
                .updatedAt(newDate)
                .build();

        BackupImportDTO dto = BackupImportDTO.builder()
                .userId(userId)
                .projects(List.of(importedDto))
                .tags(Collections.emptyList())
                .sessions(Collections.emptyList())
                .build();

        when(projectRepository.findByUserId(userId)).thenReturn(List.of(existing));
        when(tagRepository.findByUserId(userId)).thenReturn(Collections.emptyList());
        when(projectRepository.findByIdAndUserId(projectId, userId)).thenReturn(Optional.of(existing));

        backupService.importBackup(dto, userId);

        ArgumentCaptor<ProjectModel> captor = ArgumentCaptor.forClass(ProjectModel.class);
        verify(projectRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("New Name");
        assertThat(captor.getValue().getUpdatedAt()).isEqualTo(newDate);
    }
}
