package com.heavenhub.services;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.heavenhub.dtos.PropertyCreationDto;
import com.heavenhub.dtos.PropertyDto;

public interface PropertyService {
    PropertyDto createProperty(PropertyCreationDto dto);

    PropertyDto updateProperty(Long id, Long hostId, PropertyCreationDto dto);

    void deleteProperty(Long id, Long hostId);

    List<PropertyDto> getAllProperties(Long hostId, String location, BigDecimal minPrice, BigDecimal maxPrice,
                                         BigDecimal minRating, Boolean petFriendly, Boolean instantBook,
                                         Boolean superhost, String region, String propertyType);

    /**
     * Search properties with database-level filtering and pagination.
     * Much faster than loading all properties into memory.
     */
    Page<PropertyDto> searchPropertiesPageable(Long hostId, String location, BigDecimal minPrice, BigDecimal maxPrice,
                                                BigDecimal minRating, Boolean petFriendly, Boolean instantBook,
                                                Boolean superhost, String region, String propertyType, Pageable pageable);

    PropertyDto getPropertyById(Long id);
}
