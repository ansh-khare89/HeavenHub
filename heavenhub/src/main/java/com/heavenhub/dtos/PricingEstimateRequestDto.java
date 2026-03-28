package com.heavenhub.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PricingEstimateRequestDto {
    @NotNull
    private Long propertyId;
    @NotNull
    private LocalDate checkIn;
    @NotNull
    private LocalDate checkOut;
    @NotNull
    @Min(1)
    private Integer guests;
}
