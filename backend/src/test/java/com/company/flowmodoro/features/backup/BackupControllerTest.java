package com.company.flowmodoro.features.backup;

import com.company.flowmodoro.features.backup.dtos.BackupImportDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BackupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BackupService backupService;

    @MockBean
    private JwtDecoder jwtDecoder;

    @Test
    @DisplayName("Should return 401 Unauthorized when unauthenticated request calls import")
    void shouldReturn401WhenNoAuth() throws Exception {
        BackupImportDTO dto = BackupImportDTO.builder()
                .userId(UUID.randomUUID())
                .projects(Collections.emptyList())
                .tags(Collections.emptyList())
                .sessions(Collections.emptyList())
                .build();

        mockMvc.perform(post("/api/backup/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return 200 OK when authenticated request calls import with valid payload")
    void shouldReturn200WhenValidAuth() throws Exception {
        UUID userId = UUID.randomUUID();
        BackupImportDTO dto = BackupImportDTO.builder()
                .userId(userId)
                .projects(Collections.emptyList())
                .tags(Collections.emptyList())
                .sessions(Collections.emptyList())
                .build();

        doNothing().when(backupService).importBackup(any(BackupImportDTO.class), eq(userId));

        mockMvc.perform(post("/api/backup/import")
                        .with(jwt().jwt(jwt -> jwt.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }
}
