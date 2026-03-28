package com.heavenhub.dtos;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class BookingDto {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyCity;
    private Long guestId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private String status;
}
