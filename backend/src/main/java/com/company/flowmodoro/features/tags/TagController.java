package com.company.flowmodoro.features.tags;

import com.company.flowmodoro.configs.security.CurrentUser;
import com.company.flowmodoro.features.tags.dtos.TagCreateDTO;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.tags.dtos.TagUpdateBulkDTO;
import com.company.flowmodoro.features.tags.mappers.TagMapper;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/pull")
    public ResponseEntity<List<TagDTO>> pull(
        @RequestParam(required = false) java.time.OffsetDateTime lastSync,
        @CurrentUser UUID userId
    ) {
        List<TagModel> tags = service.pull(userId, lastSync);
        return ResponseEntity.ok(mapper.toDTO(tags));
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

    @PutMapping("/bulk")
    public ResponseEntity<List<TagDTO>> updateAll(
        @Valid @RequestBody List<TagUpdateBulkDTO> dtos,
        @CurrentUser UUID userId
    ) {
        List<TagModel> tags = service.updateAll(dtos, userId);
        return ResponseEntity.ok(mapper.toDTO(tags));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteAll(
        @RequestBody List<UUID> ids,
        @CurrentUser UUID userId
    ) {
        service.deleteAll(ids, userId);
        return ResponseEntity.noContent().build();
    }
}
