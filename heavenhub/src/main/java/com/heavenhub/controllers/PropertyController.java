package com.heavenhub.controllers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.heavenhub.dtos.PropertyCreationDto;
import com.heavenhub.dtos.PropertyDto;
import com.heavenhub.services.PropertyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(@Valid @RequestBody PropertyCreationDto dto) {
        return new ResponseEntity<>(propertyService.createProperty(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable Long id,
            @RequestParam Long hostId,
            @Valid @RequestBody PropertyCreationDto dto) {
        return ResponseEntity.ok(propertyService.updateProperty(id, hostId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id, @RequestParam Long hostId) {
        propertyService.deleteProperty(id, hostId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Legacy endpoint for backward compatibility.
     * WARNING: This loads all properties into memory. Use /search for better performance.
     */
    @GetMapping
    public ResponseEntity<List<PropertyDto>> getAllProperties(
            @RequestParam(required = false) Long hostId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) Boolean petFriendly,
            @RequestParam(required = false) Boolean instantBook,
            @RequestParam(required = false) Boolean superhost,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String propertyType) {
        return ResponseEntity.ok(propertyService.getAllProperties(hostId, location, minPrice, maxPrice, minRating,
                petFriendly, instantBook, superhost, region, propertyType));
    }

    /**
     * Optimized search endpoint with pagination.
     * Filters and paginates at the database level for better performance.
     * 
     * @param page Zero-indexed page number (default: 0)
     * @param size Number of results per page (default: 20, max: 100)
     * @param sort Comma-separated sort criteria, e.g., "pricePerNight,asc" or "averageRating,desc"
     */
    @GetMapping("/search")
    public ResponseEntity<Page<PropertyDto>> searchProperties(
            @RequestParam(required = false) Long hostId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) Boolean petFriendly,
            @RequestParam(required = false) Boolean instantBook,
            @RequestParam(required = false) Boolean superhost,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String propertyType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "superhost,desc") String sort) {
        
        // Parse sort parameter: "field,direction"
        String[] sortParts = sort.split(",");
        String sortField = sortParts[0].trim();
        Sort.Direction direction = sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1])
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        
        // Limit page size to prevent abuse
        int limitedSize = Math.min(Math.max(1, size), 100);
        
        Pageable pageable = PageRequest.of(page, limitedSize, Sort.by(direction, sortField));
        
        Page<PropertyDto> results = propertyService.searchPropertiesPageable(
                hostId, location, minPrice, maxPrice, minRating,
                petFriendly, instantBook, superhost, region, propertyType, pageable);
        
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getProperty(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }
}
