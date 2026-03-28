package com.heavenhub.services;

import com.heavenhub.dtos.PricingEstimateResponseDto;
import com.heavenhub.models.Property;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class PricingCalculator {

    public PricingEstimateResponseDto compute(Property property, LocalDate checkIn, LocalDate checkOut) {
        long nightCount = ChronoUnit.DAYS.between(checkIn, checkOut);
        int nights = (int) nightCount;
        if (nights < 1) {
            throw new IllegalArgumentException("Check-out must be after check-in by at least one night.");
        }

        BigDecimal nightly = property.getPricePerNight();
        BigDecimal roomSubtotal = nightly.multiply(BigDecimal.valueOf(nights));
        BigDecimal cleaning = property.getCleaningFee() != null ? property.getCleaningFee() : BigDecimal.ZERO;
        BigDecimal pct = property.getPlatformFeePercent() != null ? property.getPlatformFeePercent() : new BigDecimal("12");
        BigDecimal beforePlatform = roomSubtotal.add(cleaning);
        BigDecimal platformFee = beforePlatform.multiply(pct)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal total = beforePlatform.add(platformFee);

        PricingEstimateResponseDto dto = new PricingEstimateResponseDto();
        dto.setNights(nights);
        dto.setNightlyRate(nightly);
        dto.setRoomSubtotal(roomSubtotal);
        dto.setCleaningFee(cleaning);
        dto.setPlatformFeePercent(pct);
        dto.setPlatformFee(platformFee);
        dto.setTotal(total);
        return dto;
    }
}
