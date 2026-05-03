package com.internship.tool.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;

@Slf4j
@Component
public class AiServiceClient {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:5000}")
    private String aiServiceUrl;

    public AiServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    public String describe(String title, String description) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, String> body = Map.of(
                    "title", title,
                    "description", description != null ? description : ""
            );
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    aiServiceUrl + "/describe", request, String.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("AI describe failed: {}", e.getMessage());
            return null;
        }
    }

    public String recommend(String title, String description) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, String> body = Map.of(
                    "title", title,
                    "description", description != null ? description : ""
            );
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    aiServiceUrl + "/recommend", request, String.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("AI recommend failed: {}", e.getMessage());
            return null;
        }
    }

    public String generateReport(String title, String description) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, String> body = Map.of(
                    "title", title,
                    "description", description != null ? description : ""
            );
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    aiServiceUrl + "/generate-report", request, String.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("AI generate-report failed: {}", e.getMessage());
            return null;
        }
    }
}