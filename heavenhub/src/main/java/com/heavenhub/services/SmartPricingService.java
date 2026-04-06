package com.heavenhub.services;

import com.heavenhub.dtos.SmartPricingResponse;
import com.heavenhub.models.Property;
import com.heavenhub.repositories.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SmartPricingService {

    private final PropertyRepository propertyRepository;

    public SmartPricingResponse generatePricingForecast(Long hostId, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!property.getHost().getId().equals(hostId)) {
            throw new RuntimeException("Unauthorized: You do not own this property");
        }

        SmartPricingResponse response = new SmartPricingResponse();
        response.setPropertyId(propertyId);
        response.setBasePrice(property.getPricePerNight());

        List<SmartPricingResponse.MonthlyPricing> forecasts = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();

        // Generate 6 months of forecast
        for (int i = 0; i < 6; i++) {
            LocalDate targetDate = currentDate.plusMonths(i);
            Month month = targetDate.getMonth();
            
            SmartPricingResponse.MonthlyPricing mp = new SmartPricingResponse.MonthlyPricing();
            mp.setMonth(month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " '" + (targetDate.getYear() % 100));

            double multiplier = getMultiplierForRegionAndMonth(property.getRegion(), month);
            BigDecimal recommended = property.getPricePerNight().multiply(BigDecimal.valueOf(multiplier)).setScale(0, RoundingMode.HALF_UP);
            
            mp.setRecommendedPrice(recommended);
            mp.setRationale(multiplier > 1.0 ? "High demand season in " + property.getRegion() : (multiplier < 1.0 ? "Off-season adjustment" : "Standard season rate"));
            
            forecasts.add(mp);
        }

        response.setForecasts(forecasts);
        return response;
    }

    private double getMultiplierForRegionAndMonth(String region, Month month) {
        if (region == null) return 1.0;
        region = region.toUpperCase();
        
        switch (region) {
            case "NORTH":
                // High demand in summer (May-July) and winter holidays (Dec-Jan)
                if (month == Month.DECEMBER || month == Month.JANUARY) return 1.30;
                if (month == Month.MAY || month == Month.JUNE || month == Month.JULY) return 1.25;
                if (month == Month.AUGUST || month == Month.SEPTEMBER) return 0.85; // Monsoon
                return 1.0;
            case "WEST":
                // E.g., Goa/Mumbai - High in Winter, low in Monsoon
                if (month == Month.DECEMBER || month == Month.JANUARY || month == Month.FEBRUARY) return 1.40;
                if (month == Month.JUNE || month == Month.JULY || month == Month.AUGUST) return 0.70;
                return 1.1;
            case "SOUTH":
                // Kerala, TN - High in Winter
                if (month == Month.NOVEMBER || month == Month.DECEMBER || month == Month.JANUARY || month == Month.FEBRUARY) return 1.25;
                if (month == Month.JUNE || month == Month.JULY) return 0.8;
                return 1.0;
            default:
                // General
                if (month == Month.DECEMBER) return 1.15;
                if (month == Month.JULY || month == Month.AUGUST) return 0.90;
                return 1.0;
        }
    }
}
