package com.heavenhub.dtos;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class PropertyDto {
    private Long id;
    private String title;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private BigDecimal pricePerNight;
    private BigDecimal cleaningFee;
    private BigDecimal platformFeePercent;
    private BigDecimal averageRating;
    private String houseManual;
    private Integer maxGuests;
    private Long hostId;
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
