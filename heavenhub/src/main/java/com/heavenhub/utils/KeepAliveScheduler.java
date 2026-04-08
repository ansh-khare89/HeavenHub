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

    /**
     * Keeps the application alive by making a request every 14 minutes
     * This prevents Render from spinning down the app due to inactivity
     */
    @Scheduled(fixedDelay = 840000) // 14 minutes in milliseconds
    public void keepAppAlive() {
        try {
            // Changed from root URL to actual API endpoint
            String url = baseUrl + "/api/properties?hostId=1";
            String response = restTemplate.getForObject(url, String.class);
            log.info("Keep-alive ping successful - App is warm ✓");
        } catch (Exception e) {
            log.warn("Keep-alive ping failed (this is okay if app is just starting): " + e.getMessage());
        }
    }
}