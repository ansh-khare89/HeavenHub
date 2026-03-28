package com.heavenhub.services.impl;

import com.heavenhub.dtos.PricingEstimateRequestDto;
import com.heavenhub.dtos.PricingEstimateResponseDto;
import com.heavenhub.exceptions.ResourceNotFoundException;
import com.heavenhub.models.Property;
import com.heavenhub.repositories.PropertyRepository;
import com.heavenhub.services.PricingCalculator;
import com.heavenhub.services.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final PropertyRepository propertyRepository;
    private final PricingCalculator pricingCalculator;

    @Override
    public PricingEstimateResponseDto estimate(PricingEstimateRequestDto dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", dto.getPropertyId()));
        if (dto.getGuests() > property.getMaxGuests()) {
            throw new IllegalArgumentException("Too many guests for this property.");
        }
        return pricingCalculator.compute(property, dto.getCheckIn(), dto.getCheckOut());
    }
}
