package com.internship.tool.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@EnableScheduling
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    public void sendEvidenceCreatedNotification(String to, String title) {
        String subject = "New Audit Evidence Created: " + title;
        String body = "A new audit evidence record has been created.\n\n" +
                "Title: " + title + "\n\n" +
                "Please log in to review it.";
        sendEmail(to, subject, body);
    }

    @Scheduled(cron = "0 0 9 * * MON-FRI")
    public void sendDailyReminder() {
        log.info("Daily reminder scheduled task triggered");
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendDeadlineAlert() {
        log.info("Deadline alert scheduled task triggered");
    }
}