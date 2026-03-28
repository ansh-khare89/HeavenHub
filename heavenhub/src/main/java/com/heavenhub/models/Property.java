package com.heavenhub.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Hey future me, this is our Property entity.
 * It maps to the `properties` table.
 */
@Entity
@Table(name = "properties")
@Data
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    private String state;

    private String zipCode;

    // Using BigDecimal for money is best practice to avoid floating point math errors
    @Column(nullable = false)
    private BigDecimal pricePerNight;

    @Column(nullable = false)
    private BigDecimal cleaningFee = BigDecimal.ZERO;

    /** Average guest rating (1–5), denormalized for listing cards */
    @Column(nullable = false)
    private BigDecimal averageRating = new BigDecimal("4.80");

    /** Percent of (room subtotal + cleaning) charged as platform service fee, e.g. 12 = 12% */
    @Column(nullable = false)
    private BigDecimal platformFeePercent = new BigDecimal("12");

    @Column(columnDefinition = "TEXT")
    private String houseManual;

    private Integer maxGuests;

    /** e.g. Studio, Heritage Haveli, Sea Villa */
    @Column(nullable = false, length = 64)
    private String propertyType = "Apartment";

    private Integer bedrooms = 1;

    private Integer bathrooms = 1;

    /** Comma-separated amenities for cards and detail */
    @Column(columnDefinition = "TEXT")
    private String amenities;

    /** North, South, East, West, Central, Northeast, Islands — browse by region */
    @Column(length = 32)
    private String region;

    @Column(nullable = false)
    private boolean instantBook;

    @Column(nullable = false)
    private boolean petFriendly;

    @Column(nullable = false)
    private boolean superhost;

    /** Shown on listing cards alongside average rating */
    @Column(nullable = false)
    private Integer reviewCount = 0;

    private BigDecimal latitude;

    private BigDecimal longitude;

    // A User (HOST) can own multiple Properties. 
    // FetchType.LAZY means we don't load the entire User object from the DB unless we explicitly ask for it.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
