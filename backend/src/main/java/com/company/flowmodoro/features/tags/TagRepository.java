package com.company.flowmodoro.features.tags;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.company.flowmodoro.features.tags.dtos.TagDTO;

@Repository
public interface TagRepository extends JpaRepository<TagModel, Long> {

	@Query("""
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
			    GROUP BY
			        t.id,
			        t.name,
			        t.project.id
			""")
	List<TagDTO> findAllWithTotalFocus(Long projectId, String userId);

	boolean existsByNameAndProjectId(String name, Long projectId);

}
