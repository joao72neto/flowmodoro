package com.company.flowmodoro.security;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectRepository;
import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @MockBean
    private JwtDecoder jwtDecoder;

    @Test
    @DisplayName("Health endpoint should be public without authentication")
    void healthEndpointShouldBePublic() throws Exception {
        mockMvc.perform(get("/api/health"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Protected endpoint should return 401 Unauthorized with ErrorResponse when token is missing")
    void protectedEndpointShouldReturn401WhenNoToken() throws Exception {
        mockMvc.perform(get("/api/projects"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
            .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    @DisplayName("Sessions endpoint should return 401 Unauthorized when token is missing")
    void sessionsEndpointShouldReturn401WhenNoToken() throws Exception {
        mockMvc.perform(get("/api/sessions"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("Tags endpoint should return 401 Unauthorized when token is missing")
    void tagsEndpointShouldReturn401WhenNoToken() throws Exception {
        mockMvc.perform(get("/api/tags").param("projectId", UUID.randomUUID().toString()))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("Projects endpoint should succeed with valid JWT")
    void projectsEndpointShouldSucceedWithValidJwt() throws Exception {
        UUID userId = UUID.randomUUID();

        mockMvc.perform(get("/api/projects")
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString()))))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Sessions endpoint should succeed with valid JWT")
    void sessionsEndpointShouldSucceedWithValidJwt() throws Exception {
        UUID userId = UUID.randomUUID();

        mockMvc.perform(get("/api/sessions")
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString()))))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Pull sessions endpoint should succeed with valid JWT")
    void pullSessionsEndpointShouldSucceedWithValidJwt() throws Exception {
        UUID userId = UUID.randomUUID();

        mockMvc.perform(get("/api/sessions/pull")
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString()))))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Tags endpoint should succeed with valid JWT for existing project")
    void tagsEndpointShouldSucceedWithValidJwt() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID projectId = UUID.randomUUID();

        projectRepository.save(ProjectModel.builder()
            .id(projectId)
            .name("Test Project")
            .userId(userId)
            .build());

        mockMvc.perform(get("/api/tags")
                .param("projectId", projectId.toString())
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString()))))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Create project endpoint should succeed with valid JWT and inject userId")
    void createProjectShouldSucceedWithValidJwt() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID projectId = UUID.randomUUID();

        String payload = """
            {
                "id": "%s",
                "name": "New JWT Project"
            }
            """.formatted(projectId);

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload)
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString()))))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(projectId.toString()))
            .andExpect(jsonPath("$.name").value("New JWT Project"));
    }
}
