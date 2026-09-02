package com.company.flowmodoro.features.backup;

import com.company.flowmodoro.configs.security.CurrentUser;
import com.company.flowmodoro.features.backup.dtos.BackupImportDTO;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/backup")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importBackup(
        @Valid @RequestBody BackupImportDTO dto,
        @CurrentUser UUID userId
    ) {
        backupService.importBackup(dto, userId);
        return ResponseEntity.ok().build();
    }
}
