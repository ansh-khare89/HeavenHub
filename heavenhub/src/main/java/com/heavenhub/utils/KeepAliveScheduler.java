package com.heavenhub.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveScheduler {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveScheduler.class);

    private final RestTemplate restTemplate;
    private final String keepAliveUrl;

    public KeepAliveScheduler(RestTemplate restTemplate,
                              @Value("${app.base-url}") String keepAliveUrl) {
        this.restTemplate = restTemplate;
        this.keepAliveUrl = keepAliveUrl;
    }

    @Scheduled(initialDelayString = "${keepalive.initial-delay-ms:60000}", fixedRateString = "${keepalive.fixed-rate-ms:840000}")
    public void pingApplication() {
        try {
            var response = restTemplate.getForEntity(keepAliveUrl, String.class);
            logger.info("KeepAlive ping to {} returned {}", keepAliveUrl, response.getStatusCodeValue());
        } catch (RestClientException ex) {
            logger.warn("KeepAlive ping failed for {}: {}", keepAliveUrl, ex.getMessage());
        }
    }
}
