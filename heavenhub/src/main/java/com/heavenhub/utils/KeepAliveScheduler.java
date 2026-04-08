package com.heavenhub.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeepAliveScheduler {

    private final RestTemplate restTemplate;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Value("${keepalive.endpoint:/actuator/health}")
    private String keepAliveEndpoint;

    /**
     * Keeps the application alive by making a request every 14 minutes
     * This prevents Render from spinning down the app due to inactivity
     */
    @Scheduled(
        initialDelayString = "${keepalive.initial-delay-ms:60000}",
        fixedDelayString = "${keepalive.fixed-rate-ms:840000}"
    )
    public void keepAppAlive() {
        // Safe fallback for baseUrl
        String safeBaseUrl = (baseUrl != null && !baseUrl.isEmpty()) 
            ? baseUrl 
            : "http://localhost:8080";
        
        // Safe fallback for endpoint
        String endpoint = (keepAliveEndpoint != null && !keepAliveEndpoint.isEmpty()) 
            ? keepAliveEndpoint 
            : "/actuator/health";
        
        String url = safeBaseUrl + endpoint;
        try {
            restTemplate.getForEntity(url, String.class);
            log.info("Keep-alive ping successful - App is warm ✓");
        } catch (Exception e) {
            log.warn("Keep-alive ping failed for {}: {}", url, e.getMessage(), e);
        }
    }
}