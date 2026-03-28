package com.heavenhub.controllers;

import com.heavenhub.dtos.PropertyDto;
import com.heavenhub.services.WishlistService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<PropertyDto>> list(@RequestParam Long userId) {
        return ResponseEntity.ok(wishlistService.listForUser(userId));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> check(
            @RequestParam Long userId,
            @RequestParam Long propertyId) {
        return ResponseEntity.ok(Map.of("wishlisted", wishlistService.isWishlisted(userId, propertyId)));
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody WishlistMutationDto body) {
        wishlistService.add(body.getUserId(), body.getPropertyId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> remove(@RequestParam Long userId, @RequestParam Long propertyId) {
        wishlistService.remove(userId, propertyId);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class WishlistMutationDto {
        private Long userId;
        private Long propertyId;
    }
}
