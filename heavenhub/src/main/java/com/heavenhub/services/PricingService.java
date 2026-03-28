package com.heavenhub.services;

import com.heavenhub.dtos.PricingEstimateRequestDto;
import com.heavenhub.dtos.PricingEstimateResponseDto;

public interface PricingService {
    PricingEstimateResponseDto estimate(PricingEstimateRequestDto dto);
}
