package com.company.flowmodoro.features.tags;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<TagModel, Long> {

	List<TagModel> findByProjectId(Long projectId);

}
