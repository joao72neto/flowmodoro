package com.company.flowmodoro.features.projects;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.company.flowmodoro.features.projects.dtos.ProjectDTO;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectModel, Long> {

	@Query("""
			    SELECT new com.company.flowmodoro.features.projects.dtos.ProjectDTO(
			        p.id,
			        p.name,
			        COALESCE(SUM(s.focus), 0)
			    )
			    FROM ProjectModel p
			    LEFT JOIN SessionModel s
			        ON s.project.id = p.id
			        AND s.userId = :userId
			    WHERE p.userId = :userId
			    GROUP BY p.id, p.name
					ORDER BY p.id DESC
			""")
	List<ProjectDTO> findAllWithTotalFocus(String userId);

	boolean existsByNameAndUserId(String name, String userId);

}
