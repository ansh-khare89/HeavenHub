package com.heavenhub.controllers;

import com.heavenhub.dtos.ReviewCreateDto;
import com.heavenhub.dtos.ReviewDto;
import com.heavenhub.dtos.ReviewReplyDto;
import com.heavenhub.services.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/properties/{propertyId}/reviews")
    public ResponseEntity<List<ReviewDto>> listForProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.listForProperty(propertyId));
    }

    @PostMapping("/properties/{propertyId}/reviews")
    public ResponseEntity<ReviewDto> create(
            @PathVariable Long propertyId,
            @Valid @RequestBody ReviewCreateDto dto) {
        return new ResponseEntity<>(reviewService.create(propertyId, dto), HttpStatus.CREATED);
    }

    @PutMapping("/reviews/{reviewId}/reply")
    public ResponseEntity<ReviewDto> reply(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewReplyDto dto) {
        return ResponseEntity.ok(reviewService.reply(reviewId, dto));
    }
}
