package com.heavenhub.controllers;

import com.heavenhub.dtos.PropertyCreationDto;
import com.heavenhub.dtos.PropertyDto;
import com.heavenhub.services.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

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

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getProperty(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }
}
