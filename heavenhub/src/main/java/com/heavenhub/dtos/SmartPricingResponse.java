package com.heavenhub.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class SmartPricingResponse {
    private Long propertyId;
    private BigDecimal basePrice;
    private List<MonthlyPricing> forecasts;

    @Data
    public static class MonthlyPricing {
        private String month;
        private BigDecimal recommendedPrice;
        private String rationale;
    }
}
