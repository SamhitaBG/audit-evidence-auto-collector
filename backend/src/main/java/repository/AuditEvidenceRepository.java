package com.internship.tool.repository;

import com.internship.tool.entity.AuditEvidence;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditEvidenceRepository extends JpaRepository<AuditEvidence, Long> {

    Page<AuditEvidence> findByIsDeletedFalse(Pageable pageable);

    @Query("SELECT a FROM AuditEvidence a WHERE a.isDeleted = false AND " +
            "(LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<AuditEvidence> searchByKeyword(@Param("query") String query, Pageable pageable);

    Page<AuditEvidence> findByStatusAndIsDeletedFalse(String status, Pageable pageable);
}