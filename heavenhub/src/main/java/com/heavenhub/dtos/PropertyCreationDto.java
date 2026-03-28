package com.heavenhub.dtos;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class PropertyCreationDto {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotBlank private String address;
    @NotBlank private String city;
    private String state;
    private String zipCode;
    @NotNull @Min(1) private BigDecimal pricePerNight;
    private BigDecimal cleaningFee;
    private BigDecimal averageRating;
    private BigDecimal platformFeePercent;
    private String houseManual;
    @NotNull @Min(1) private Integer maxGuests;
    @NotNull private Long hostId;
    private String propertyType;
    private Integer bedrooms;
    private Integer bathrooms;
    private String amenities;
    private String region;
    private Boolean instantBook;
    private Boolean petFriendly;
    private Boolean superhost;
    private Integer reviewCount;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
