package com.company.flowmodoro.features.tags;

import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.tags.dtos.TagPayloadDTO;
import com.company.flowmodoro.features.tags.dtos.TagUpdateDTO;
import com.company.flowmodoro.features.tags.mappers.TagMapper;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
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

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService service;

    private final TagMapper mapper;

    public TagController(TagService service, TagMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<TagDTO>> saveAll(
        @Valid @RequestBody List<TagPayloadDTO> dtos,
        @RequestParam UUID projectId,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        List<TagModel> tags = service.saveAll(
            mapper.fromPayload(dtos),
            projectId,
            userId
        );

        return ResponseEntity.status(201).body(mapper.toDTO(tags));
    }

    @PostMapping
    public ResponseEntity<TagDTO> save(
        @Valid @RequestBody TagPayloadDTO dto,
        @RequestParam UUID projectId,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        TagModel tag = service.save(mapper.fromPayload(dto), projectId, userId);
        return ResponseEntity.status(201).body(mapper.toDTO(tag));
    }

    @GetMapping
    public ResponseEntity<List<TagDTO>> findByProject(
        @RequestParam UUID projectId,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        List<TagDTO> tags = service.findAllByProject(projectId, userId);
        return ResponseEntity.ok(tags);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagDTO> update(
        @PathVariable UUID id,
        @Valid @RequestBody TagUpdateDTO dto,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        TagModel tag = service.update(id, dto, userId);
        return ResponseEntity.ok(mapper.toDTO(tag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable UUID id,
        @RequestHeader("X-User-Id") UUID userId
    ) {
        service.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
