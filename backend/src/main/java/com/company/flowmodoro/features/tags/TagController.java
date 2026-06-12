package com.company.flowmodoro.features.tags;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.tags.dtos.TagUpdateDTO;
import com.company.flowmodoro.features.tags.mappers.TagMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tags")
public class TagController {

	private final TagService tagService;

	private final TagMapper tagMapper;

	public TagController(TagService tagService, TagMapper tagMapper) {
		this.tagService = tagService;
		this.tagMapper = tagMapper;
	}

	@PostMapping
	public ResponseEntity<TagDTO> save(@Valid @RequestBody TagDTO dto, @RequestHeader("X-User-Id") String userId) {
		TagModel tag = tagService.save(tagMapper.toEntity(dto), dto.getProjectId(), userId);
		return ResponseEntity.status(201).body(tagMapper.toDTO(tag));
	}

	@GetMapping
	public ResponseEntity<List<TagDTO>> findByProject(@RequestParam Long projectId,
			@RequestHeader("X-User-Id") String userId) {
		List<TagModel> tags = tagService.findAllByProject(projectId, userId);
		return ResponseEntity.ok(tagMapper.toDTO(tags));
	}

	@PutMapping("/{id}")
	public ResponseEntity<TagDTO> update(@PathVariable Long id, @Valid @RequestBody TagUpdateDTO dto,
			@RequestHeader("X-User-Id") String userId) {
		TagModel tag = tagService.update(id, dto, userId);
		return ResponseEntity.ok(tagMapper.toDTO(tag));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id, @RequestHeader("X-User-Id") String userId) {
		tagService.delete(id, userId);
		return ResponseEntity.noContent().build();
	}

}
