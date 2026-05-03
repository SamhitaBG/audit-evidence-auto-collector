package com.internship.tool;

import com.internship.tool.entity.AuditEvidence;
import com.internship.tool.repository.AuditEvidenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AuditEvidenceRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        String[][] data = {
                {"Access Control Review", "Review of user access rights", "OPEN", "SECURITY"},
                {"Password Policy Audit", "Audit of password complexity rules", "CLOSED", "SECURITY"},
                {"Firewall Configuration", "Review firewall rules and policies", "IN_PROGRESS", "NETWORK"},
                {"Data Backup Verification", "Verify backup procedures", "OPEN", "DATA"},
                {"Encryption Standards", "Review data encryption methods", "CLOSED", "SECURITY"},
                {"Incident Response Plan", "Evaluate incident response procedures", "IN_PROGRESS", "PROCESS"},
                {"Vendor Risk Assessment", "Assess third-party vendor risks", "OPEN", "COMPLIANCE"},
                {"Network Monitoring", "Review network monitoring tools", "CLOSED", "NETWORK"},
                {"Patch Management", "Verify patching procedures", "IN_PROGRESS", "OPERATIONS"},
                {"User Training Records", "Check security awareness training", "OPEN", "COMPLIANCE"},
                {"Physical Security Audit", "Review physical access controls", "CLOSED", "PHYSICAL"},
                {"Log Management Review", "Audit log retention policies", "OPEN", "OPERATIONS"},
                {"Database Security", "Review database access controls", "IN_PROGRESS", "DATA"},
                {"API Security Review", "Test API authentication mechanisms", "OPEN", "SECURITY"},
                {"Cloud Configuration", "Review cloud security settings", "CLOSED", "CLOUD"},
                {"Disaster Recovery Test", "Test disaster recovery procedures", "IN_PROGRESS", "PROCESS"},
                {"Compliance Checklist", "Verify regulatory compliance", "OPEN", "COMPLIANCE"},
                {"Software Inventory", "Audit installed software licenses", "CLOSED", "OPERATIONS"},
                {"Mobile Device Policy", "Review mobile device management", "OPEN", "POLICY"},
                {"Email Security Audit", "Check email filtering and security", "IN_PROGRESS", "SECURITY"},
                {"Change Management", "Review change control procedures", "OPEN", "PROCESS"},
                {"Identity Management", "Audit identity and access management", "CLOSED", "SECURITY"},
                {"Risk Register Update", "Update organizational risk register", "IN_PROGRESS", "COMPLIANCE"},
                {"Network Segmentation", "Review network segmentation rules", "OPEN", "NETWORK"},
                {"Security Metrics", "Collect and analyze security metrics", "CLOSED", "OPERATIONS"},
                {"Third Party Audit", "Audit third party integrations", "OPEN", "COMPLIANCE"},
                {"Vulnerability Scan", "Run vulnerability assessment", "IN_PROGRESS", "SECURITY"},
                {"Business Continuity", "Review business continuity plan", "OPEN", "PROCESS"},
                {"Data Classification", "Review data classification policy", "CLOSED", "DATA"},
                {"Security Governance", "Review security governance framework", "OPEN", "COMPLIANCE"}
        };

        for (String[] row : data) {
            AuditEvidence e = new AuditEvidence();
            e.setTitle(row[0]);
            e.setDescription(row[1]);
            e.setStatus(row[2]);
            e.setEvidenceType(row[3]);
            e.setIsDeleted(false);
            repository.save(e);
        }
        log.info("✅ Seeded 30 audit evidence records.");
    }
}