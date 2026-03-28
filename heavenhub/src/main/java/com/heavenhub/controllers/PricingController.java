package com.heavenhub.controllers;

import com.heavenhub.dtos.PricingEstimateRequestDto;
import com.heavenhub.dtos.PricingEstimateResponseDto;
import com.heavenhub.services.PricingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;

    @PostMapping("/estimate")
    public ResponseEntity<PricingEstimateResponseDto> estimate(@Valid @RequestBody PricingEstimateRequestDto dto) {
        return ResponseEntity.ok(pricingService.estimate(dto));
    }
}
