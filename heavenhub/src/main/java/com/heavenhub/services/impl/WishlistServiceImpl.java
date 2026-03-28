package com.heavenhub.services.impl;

import com.heavenhub.dtos.PropertyDto;
import com.heavenhub.exceptions.ResourceNotFoundException;
import com.heavenhub.models.Property;
import com.heavenhub.models.User;
import com.heavenhub.models.Wishlist;
import com.heavenhub.repositories.PropertyRepository;
import com.heavenhub.repositories.UserRepository;
import com.heavenhub.repositories.WishlistRepository;
import com.heavenhub.services.WishlistService;
import com.heavenhub.utils.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final DtoMapper dtoMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PropertyDto> listForUser(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(Wishlist::getProperty)
                .map(dtoMapper::toPropertyDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void add(Long userId, Long propertyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
        if (wishlistRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
            return;
        }
        Wishlist w = new Wishlist();
        w.setUser(user);
        w.setProperty(property);
        wishlistRepository.save(w);
    }

    @Override
    @Transactional
    public void remove(Long userId, Long propertyId) {
        wishlistRepository.deleteByUserIdAndPropertyId(userId, propertyId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isWishlisted(Long userId, Long propertyId) {
        return wishlistRepository.existsByUserIdAndPropertyId(userId, propertyId);
    }
}
