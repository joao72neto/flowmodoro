package com.company.flowmodoro.features.tags;

import com.company.flowmodoro.configs.security.CurrentUser;
import com.company.flowmodoro.features.tags.dtos.TagCreateDTO;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.tags.dtos.TagUpdateBulkDTO;
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

    @GetMapping
    public ResponseEntity<List<TagDTO>> findByProject(
        @RequestParam UUID projectId,
        @CurrentUser UUID userId
    ) {
        List<TagDTO> tags = service.findAllByProject(projectId, userId);
        return ResponseEntity.ok(tags);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<TagDTO>> saveAll(
        @Valid @RequestBody List<TagCreateDTO> dtos,
        @CurrentUser UUID userId
    ) {
        List<TagModel> tags = service.saveAll(
            mapper.fromPayload(dtos, userId),
            userId
        );
        return ResponseEntity.status(201).body(mapper.toDTO(tags));
    }

    @PostMapping
    public ResponseEntity<TagDTO> save(
        @Valid @RequestBody TagCreateDTO dto,
        @CurrentUser UUID userId
    ) {
        TagModel tag = service.save(mapper.fromPayload(dto, userId), userId);
        return ResponseEntity.status(201).body(mapper.toDTO(tag));
    }

    @PutMapping("/bulk")
    public ResponseEntity<List<TagDTO>> updateAll(
        @Valid @RequestBody List<TagUpdateBulkDTO> dtos,
        @CurrentUser UUID userId
    ) {
        List<TagModel> tags = service.updateAll(dtos, userId);
        return ResponseEntity.ok(mapper.toDTO(tags));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagDTO> update(
        @PathVariable UUID id,
        @Valid @RequestBody TagUpdateDTO dto,
        @CurrentUser UUID userId
    ) {
        TagModel tag = service.update(id, dto, userId);
        return ResponseEntity.ok(mapper.toDTO(tag));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteAll(
        @RequestBody List<UUID> ids,
        @CurrentUser UUID userId
    ) {
        service.deleteAll(ids, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable UUID id,
        @CurrentUser UUID userId
    ) {
        service.delete(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pull")
    public ResponseEntity<List<TagDTO>> pull(
        @RequestParam(required = false) java.time.OffsetDateTime lastSync,
        @CurrentUser UUID userId
    ) {
        List<TagModel> tags = service.pull(userId, lastSync);
        return ResponseEntity.ok(mapper.toDTO(tags));
    }
}
