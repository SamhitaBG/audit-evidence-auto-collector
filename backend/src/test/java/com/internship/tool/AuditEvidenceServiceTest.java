package com.internship.tool;

import com.internship.tool.entity.AuditEvidence;
import com.internship.tool.exception.BadRequestException;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.AuditEvidenceRepository;
import com.internship.tool.service.AuditEvidenceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditEvidenceServiceTest {

    @Mock
    private AuditEvidenceRepository repository;

    @InjectMocks
    private AuditEvidenceService service;

    private AuditEvidence evidence;

    @BeforeEach
    void setUp() {
        evidence = new AuditEvidence();
        evidence.setId(1L);
        evidence.setTitle("Test Evidence");
        evidence.setStatus("OPEN");
        evidence.setIsDeleted(false);
    }

    @Test
    void getById_ShouldReturnEvidence_WhenExists() {
        when(repository.findById(1L)).thenReturn(Optional.of(evidence));
        AuditEvidence result = service.getById(1L);
        assertNotNull(result);
        assertEquals("Test Evidence", result.getTitle());
    }

    @Test
    void getById_ShouldThrow_WhenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class,
                () -> service.getById(99L));
    }

    @Test
    void getById_ShouldThrow_WhenDeleted() {
        evidence.setIsDeleted(true);
        when(repository.findById(1L)).thenReturn(Optional.of(evidence));
        assertThrows(ResourceNotFoundException.class,
                () -> service.getById(1L));
    }

    @Test
    void create_ShouldSave_WhenValid() {
        when(repository.save(any())).thenReturn(evidence);
        AuditEvidence result = service.create(evidence);
        assertNotNull(result);
        verify(repository, times(1)).save(evidence);
    }

    @Test
    void create_ShouldThrow_WhenTitleEmpty() {
        evidence.setTitle("");
        assertThrows(BadRequestException.class,
                () -> service.create(evidence));
    }

    @Test
    void create_ShouldThrow_WhenTitleNull() {
        evidence.setTitle(null);
        assertThrows(BadRequestException.class,
                () -> service.create(evidence));
    }

    @Test
    void create_ShouldThrow_WhenStatusNull() {
        evidence.setStatus(null);
        assertThrows(BadRequestException.class,
                () -> service.create(evidence));
    }

    @Test
    void delete_ShouldMarkDeleted() {
        when(repository.findById(1L)).thenReturn(Optional.of(evidence));
        when(repository.save(any())).thenReturn(evidence);
        service.delete(1L);
        assertTrue(evidence.getIsDeleted());
        verify(repository, times(1)).save(evidence);
    }

    @Test
    void update_ShouldUpdateTitle() {
        AuditEvidence updated = new AuditEvidence();
        updated.setTitle("Updated Title");
        when(repository.findById(1L)).thenReturn(Optional.of(evidence));
        when(repository.save(any())).thenReturn(evidence);
        AuditEvidence result = service.update(1L, updated);
        assertEquals("Updated Title", result.getTitle());
    }

    @Test
    void create_ShouldSetIsDeletedFalse() {
        evidence.setIsDeleted(null);
        when(repository.save(any())).thenReturn(evidence);
        service.create(evidence);
        assertFalse(evidence.getIsDeleted());
    }
}