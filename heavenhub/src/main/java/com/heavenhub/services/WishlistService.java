package com.heavenhub.services;

import com.heavenhub.dtos.PropertyDto;

import java.util.List;

public interface WishlistService {
    List<PropertyDto> listForUser(Long userId);

    void add(Long userId, Long propertyId);

    void remove(Long userId, Long propertyId);

    boolean isWishlisted(Long userId, Long propertyId);
}
