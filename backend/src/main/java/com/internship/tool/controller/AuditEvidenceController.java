package com.internship.tool.controller;

import com.internship.tool.entity.AuditEvidence;
import com.internship.tool.service.AuditEvidenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evidence")
@RequiredArgsConstructor
public class AuditEvidenceController {

    private final AuditEvidenceService service;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuditEvidence>> getAll(Pageable pageable) {
        return ResponseEntity.ok(service.getAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuditEvidence> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuditEvidence> create(
            @Valid @RequestBody AuditEvidence evidence) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(evidence));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuditEvidence> update(
            @PathVariable Long id,
            @RequestBody AuditEvidence evidence) {
        return ResponseEntity.ok(service.update(id, evidence));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuditEvidence>> search(
            @RequestParam String q,
            Pageable pageable) {
        return ResponseEntity.ok(service.search(q, pageable));
    }

    @GetMapping("/export")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> exportCsv(Pageable pageable) {
        Page<AuditEvidence> all = service.getAll(pageable);
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Title,Description,Status,EvidenceType,CreatedAt\n");
        all.getContent().forEach(e -> csv.append(
                        e.getId()).append(",")
                .append(e.getTitle()).append(",")
                .append(e.getDescription() != null ? e.getDescription() : "").append(",")
                .append(e.getStatus()).append(",")
                .append(e.getEvidenceType() != null ? e.getEvidenceType() : "").append(",")
                .append(e.getCreatedAt()).append("\n"));
        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=audit-evidence.csv")
                .header("Content-Type", "text/csv")
                .body(csv.toString());
    }
}