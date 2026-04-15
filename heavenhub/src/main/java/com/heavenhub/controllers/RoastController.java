package com.heavenhub.controllers;

import com.heavenhub.models.PropertyRoast;
import com.heavenhub.repositories.PropertyRoastRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roasts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoastController {

    private final PropertyRoastRepository roastRepository;

    @GetMapping
    public ResponseEntity<List<PropertyRoast>> getAllRoasts() {
        return ResponseEntity.ok(roastRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<PropertyRoast> addRoast(@RequestBody PropertyRoast roast) {
        return ResponseEntity.ok(roastRepository.save(roast));
    }
}
