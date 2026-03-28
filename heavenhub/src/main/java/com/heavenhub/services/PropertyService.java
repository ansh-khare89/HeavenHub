package com.heavenhub.services;
import com.heavenhub.dtos.PropertyCreationDto;
import com.heavenhub.dtos.PropertyDto;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyService {
    PropertyDto createProperty(PropertyCreationDto dto);

    PropertyDto updateProperty(Long id, Long hostId, PropertyCreationDto dto);

    void deleteProperty(Long id, Long hostId);

    List<PropertyDto> getAllProperties(Long hostId, String location, BigDecimal minPrice, BigDecimal maxPrice,
                                         BigDecimal minRating, Boolean petFriendly, Boolean instantBook,
                                         Boolean superhost, String region, String propertyType);

    PropertyDto getPropertyById(Long id);
}
