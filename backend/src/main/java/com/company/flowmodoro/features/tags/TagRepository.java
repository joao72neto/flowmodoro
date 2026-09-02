package com.company.flowmodoro.features.tags;

import com.company.flowmodoro.features.tags.dtos.TagDTO;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<TagModel, UUID> {
    @Query(
        """
            SELECT new com.company.flowmodoro.features.tags.dtos.TagDTO(
                t.id,
                t.name,
                t.project.id,
                COALESCE(SUM(s.focus), 0)
            )
            FROM TagModel t
            LEFT JOIN SessionModel s
                ON s.tag.id = t.id
                AND s.userId = :userId
            WHERE t.project.id = :projectId
              AND t.project.userId = :userId
              AND t.deletedAt IS NULL
            GROUP BY
                t.id,
                t.name,
                t.project.id
        		ORDER BY t.id DESC
        """
    )
    List<TagDTO> findAllWithTotalFocus(UUID projectId, UUID userId);

    boolean existsByNameAndProjectId(String name, UUID projectId);

    @Query(
        "SELECT t FROM TagModel t WHERE t.project.userId = :userId AND t.updatedAt >= :lastSync"
    )
    List<TagModel> findByUserIdAndUpdatedAtGreaterThanEqual(
        @Param("userId") UUID userId,
        @Param("lastSync") OffsetDateTime lastSync
    );

    @Query("SELECT t FROM TagModel t WHERE t.project.userId = :userId")
    List<TagModel> findByUserId(@Param("userId") UUID userId);

    @Query(
        "SELECT t FROM TagModel t WHERE t.id = :id AND t.project.userId = :userId"
    )
    Optional<TagModel> findByIdAndUserId(
        @Param("id") UUID id,
        @Param("userId") UUID userId
    );
}
