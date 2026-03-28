package com.heavenhub.dtos;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequestDto {
    @NotNull
    private Long propertyId;
    @NotNull
    private Long guestId;
    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    @NotNull
    @Min(1)
    private Integer numberOfGuests;
}
