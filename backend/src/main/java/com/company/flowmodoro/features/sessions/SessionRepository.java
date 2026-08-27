package com.company.flowmodoro.features.sessions;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.tags.TagModel;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<SessionModel, UUID> {
    @Query(
        value = "SELECT DISTINCT s.date FROM SessionModel s WHERE s.userId = :userId",
        countQuery = "SELECT COUNT(DISTINCT s.date) FROM SessionModel s WHERE s.userId = :userId"
    )
    Page<LocalDate> findDistinctDates(UUID userId, Pageable pageable);

    List<SessionModel> findByUserIdAndDateInOrderByIdDesc(
        UUID userId,
        List<LocalDate> dates
    );

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
}
