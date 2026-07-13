package com.company.flowmodoro.features.tags;

import com.company.flowmodoro.features.tags.dtos.TagDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
            GROUP BY
                t.id,
                t.name,
                t.project.id
        		ORDER BY t.id DESC
        """
    )
    List<TagDTO> findAllWithTotalFocus(UUID projectId, UUID userId);

    boolean existsByNameAndProjectId(String name, UUID projectId);
}
