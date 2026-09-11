package com.company.flowmodoro.features.sessions;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.tags.TagModel;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<SessionModel, UUID> {
    List<SessionModel> findByUserIdAndUpdatedAtGreaterThanEqualOrderByIdDesc(
        UUID userId,
        OffsetDateTime lastSync
    );

    List<SessionModel> findByUserIdOrderByIdDesc(UUID userId);

    List<SessionModel> findByProjectAndUserId(
        ProjectModel project,
        UUID userId
    );

    List<SessionModel> findByTagAndUserId(TagModel tag, UUID userId);

    Optional<SessionModel> findByIdAndUserId(UUID id, UUID userId);
}
