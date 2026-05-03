package com.internship.tool.service;

import com.internship.tool.entity.AuditEvidence;
import com.internship.tool.exception.BadRequestException;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.AuditEvidenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditEvidenceService {

    private final AuditEvidenceRepository repository;

    @Cacheable(value = "evidenceList", key = "#pageable")
    public Page<AuditEvidence> getAll(Pageable pageable) {
        return repository.findByIsDeletedFalse(pageable);
    }

    @Cacheable(value = "evidence", key = "#id")
    public AuditEvidence getById(Long id) {
        AuditEvidence evidence = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Evidence not found with id: " + id));
        if (Boolean.TRUE.equals(evidence.getIsDeleted())) {
            throw new ResourceNotFoundException("Evidence not found with id: " + id);
        }
        return evidence;
    }

    @CacheEvict(value = {"evidence", "evidenceList"}, allEntries = true)
    public AuditEvidence create(AuditEvidence evidence) {
        if (evidence.getTitle() == null || evidence.getTitle().isBlank()) {
            throw new BadRequestException("Title cannot be empty");
        }
        if (evidence.getStatus() == null || evidence.getStatus().isBlank()) {
            throw new BadRequestException("Status cannot be empty");
        }
        evidence.setIsDeleted(false);
        return repository.save(evidence);
    }

    @CacheEvict(value = {"evidence", "evidenceList"}, allEntries = true)
    public AuditEvidence update(Long id, AuditEvidence updated) {
        AuditEvidence existing = getById(id);
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getEvidenceType() != null) existing.setEvidenceType(updated.getEvidenceType());
        return repository.save(existing);
    }

    @CacheEvict(value = {"evidence", "evidenceList"}, allEntries = true)
    public void delete(Long id) {
        AuditEvidence existing = getById(id);
        existing.setIsDeleted(true);
        repository.save(existing);
    }

    public Page<AuditEvidence> search(String query, Pageable pageable) {
        return repository.searchByKeyword(query, pageable);
    }
}