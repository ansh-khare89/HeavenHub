package com.heavenhub.dtos;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class HostAnalyticsDto {
    private BigDecimal totalEarnings;
    private BigDecimal pendingPayout;
    private List<MonthlyEarningDto> monthlyEarnings;

    @Data
    public static class MonthlyEarningDto {
        private String month;
        private BigDecimal amount;
    }
}
