package com.heavenhub.services.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.heavenhub.dtos.PropertyCreationDto;
import com.heavenhub.dtos.PropertyDto;
import com.heavenhub.exceptions.ResourceNotFoundException;
import com.heavenhub.models.Property;
import com.heavenhub.models.User;
import com.heavenhub.repositories.PropertyRepository;
import com.heavenhub.repositories.UserRepository;
import com.heavenhub.services.PropertyService;
import com.heavenhub.utils.DtoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;

    @Override
    @Transactional
    public PropertyDto createProperty(PropertyCreationDto dto) {
        User host = userRepository.findById(dto.getHostId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getHostId()));

        Property prop = new Property();
        applyCreationDto(prop, dto);
        prop.setHost(host);

        Property saved = propertyRepository.save(prop);
        return dtoMapper.toPropertyDto(saved);
    }

    @Override
    @Transactional
    public PropertyDto updateProperty(Long id, Long hostId, PropertyCreationDto dto) {
        Property prop = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        if (!prop.getHost().getId().equals(hostId)) {
            throw new IllegalArgumentException("You can only edit your own listings.");
        }
        applyCreationDto(prop, dto);
        return dtoMapper.toPropertyDto(propertyRepository.save(prop));
    }

    @Override
    @Transactional
    public void deleteProperty(Long id, Long hostId) {
        Property prop = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        if (!prop.getHost().getId().equals(hostId)) {
            throw new IllegalArgumentException("You can only delete your own listings.");
        }
        propertyRepository.delete(prop);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyDto> getAllProperties(Long hostId, String location, BigDecimal minPrice, BigDecimal maxPrice,
                                                BigDecimal minRating, Boolean petFriendly, Boolean instantBook,
                                                Boolean superhost, String region, String propertyType) {
        String loc = location != null ? location.trim().toLowerCase() : "";
        String reg = region != null ? region.trim().toLowerCase() : "";
        String ptype = propertyType != null ? propertyType.trim().toLowerCase() : "";
        return propertyRepository.findAllWithHost().stream()
                .filter(p -> p.getHost() != null && (hostId == null || p.getHost().getId().equals(hostId)))
                .filter(p -> loc.isEmpty()
                        || (p.getCity() != null && p.getCity().toLowerCase().contains(loc))
                        || (p.getState() != null && p.getState().toLowerCase().contains(loc)))
                .filter(p -> minPrice == null || p.getPricePerNight().compareTo(minPrice) >= 0)
                .filter(p -> maxPrice == null || p.getPricePerNight().compareTo(maxPrice) <= 0)
                .filter(p -> minRating == null || ratingAtLeast(p.getAverageRating(), minRating))
                .filter(p -> petFriendly == null || p.isPetFriendly() == petFriendly)
                .filter(p -> instantBook == null || p.isInstantBook() == instantBook)
                .filter(p -> superhost == null || p.isSuperhost() == superhost)
                .filter(p -> reg.isEmpty()
                        || (p.getRegion() != null && p.getRegion().toLowerCase().equals(reg)))
                .filter(p -> ptype.isEmpty()
                        || (p.getPropertyType() != null && p.getPropertyType().toLowerCase().contains(ptype)))
                .map(dtoMapper::toPropertyDto)
                .collect(Collectors.toList());
    }

    /**
     * Optimized method that filters & paginates at the database level.
     * Use this for the frontend listing page to avoid loading all properties into memory.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<PropertyDto> searchPropertiesPageable(Long hostId, String location, BigDecimal minPrice, BigDecimal maxPrice,
                                                      BigDecimal minRating, Boolean petFriendly, Boolean instantBook,
                                                      Boolean superhost, String region, String propertyType, Pageable pageable) {
        Page<Property> results = propertyRepository.searchProperties(
                hostId,
                location,
                minPrice,
                maxPrice,
                minRating,
                petFriendly,
                instantBook,
                superhost,
                region,
                propertyType,
                pageable);
        return results.map(dtoMapper::toPropertyDto);
    }

    /** Null or missing rating does not satisfy a min-rating filter (avoids NPE on legacy rows). */
    private static boolean ratingAtLeast(BigDecimal rating, BigDecimal minRating) {
        return rating != null && rating.compareTo(minRating) >= 0;
    }

    @Override
    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findByIdWithHost(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        return dtoMapper.toPropertyDto(property);
    }

    private void applyCreationDto(Property prop, PropertyCreationDto dto) {
        prop.setTitle(dto.getTitle());
        prop.setDescription(dto.getDescription());
        prop.setAddress(dto.getAddress());
        prop.setCity(dto.getCity());
        prop.setState(dto.getState());
        prop.setZipCode(dto.getZipCode());
        prop.setPricePerNight(dto.getPricePerNight());
        prop.setMaxGuests(dto.getMaxGuests());
        prop.setCleaningFee(dto.getCleaningFee() != null ? dto.getCleaningFee() : BigDecimal.ZERO);
        if (dto.getAverageRating() != null) {
            prop.setAverageRating(dto.getAverageRating());
        }
        if (dto.getPlatformFeePercent() != null) {
            prop.setPlatformFeePercent(dto.getPlatformFeePercent());
        }
        if (dto.getHouseManual() != null) {
            prop.setHouseManual(dto.getHouseManual());
        }
        if (dto.getPropertyType() != null) {
            prop.setPropertyType(dto.getPropertyType());
        }
        if (dto.getBedrooms() != null) {
            prop.setBedrooms(dto.getBedrooms());
        }
        if (dto.getBathrooms() != null) {
            prop.setBathrooms(dto.getBathrooms());
        }
        if (dto.getAmenities() != null) {
            prop.setAmenities(dto.getAmenities());
        }
        if (dto.getRegion() != null) {
            prop.setRegion(dto.getRegion());
        }
        if (dto.getInstantBook() != null) {
            prop.setInstantBook(dto.getInstantBook());
        }
        if (dto.getPetFriendly() != null) {
            prop.setPetFriendly(dto.getPetFriendly());
        }
        if (dto.getSuperhost() != null) {
            prop.setSuperhost(dto.getSuperhost());
        }
        if (dto.getReviewCount() != null) {
            prop.setReviewCount(dto.getReviewCount());
        }
        if (dto.getLatitude() != null) {
            prop.setLatitude(dto.getLatitude());
        }
        if (dto.getLongitude() != null) {
            prop.setLongitude(dto.getLongitude());
        }
    }
}
