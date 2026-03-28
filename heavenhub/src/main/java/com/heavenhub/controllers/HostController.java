package com.heavenhub.controllers;

import com.heavenhub.dtos.HostAnalyticsDto;
import com.heavenhub.dtos.ReviewDto;
import com.heavenhub.services.HostAnalyticsService;
import com.heavenhub.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/host")
@RequiredArgsConstructor
public class HostController {

    private final HostAnalyticsService hostAnalyticsService;
    private final ReviewService reviewService;

    @GetMapping("/{hostId}/analytics")
    public ResponseEntity<HostAnalyticsDto> analytics(@PathVariable Long hostId) {
        return ResponseEntity.ok(hostAnalyticsService.getAnalytics(hostId));
    }

    @GetMapping("/{hostId}/reviews")
    public ResponseEntity<List<ReviewDto>> reviewsForHost(@PathVariable Long hostId) {
        return ResponseEntity.ok(reviewService.listForHost(hostId));
    }
}
