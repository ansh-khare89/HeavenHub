package com.heavenhub.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PricingEstimateResponseDto {
    private int nights;
    private BigDecimal nightlyRate;
    private BigDecimal roomSubtotal;
    private BigDecimal cleaningFee;
    private BigDecimal platformFeePercent;
    private BigDecimal platformFee;
    private BigDecimal total;
}
