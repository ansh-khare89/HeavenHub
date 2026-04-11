package com.heavenhub.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.heavenhub.models.Property;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    /** Eager-fetch all properties with host for backward compatibility. */
    @Query("SELECT DISTINCT p FROM Property p JOIN FETCH p.host")
    List<Property> findAllWithHost();

    @Query("select p from Property p join fetch p.host where p.id = :id")
    Optional<Property> findByIdWithHost(Long id);

    // Spring magically creates a WHERE city = ? query here!
    List<Property> findByCity(String city);
    
    // Find all properties owned by a specific host
    List<Property> findByHostId(Long hostId);

    /**
     * Optimized search with database-level filtering and pagination.
     * Native SQL for PostgreSQL compatibility with explicit type casting.
     */
    @Query(nativeQuery = true, value = """
        SELECT p.id, p.address, p.amenities, p.average_rating, p.bathrooms, p.bedrooms, 
               p.city, p.cleaning_fee, p.created_at, p.description, p.host_id,
               p.house_manual, p.instant_book, p.latitude, p.longitude, p.max_guests,
               p.pet_friendly, p.platform_fee_percent, p.price_per_night, p.property_type,
               p.region, p.review_count, p.state, p.superhost, p.title, p.updated_at, p.zip_code
        FROM properties p
        WHERE (:hostId IS NULL OR p.host_id = :hostId)
          AND (:location IS NULL OR LOWER(p.city::text) LIKE LOWER(CONCAT('%', :location, '%'))
                                   OR LOWER(p.state::text) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:minPrice IS NULL OR p.price_per_night >= :minPrice)
          AND (:maxPrice IS NULL OR p.price_per_night <= :maxPrice)
          AND (:minRating IS NULL OR p.average_rating >= :minRating)
          AND (:petFriendly IS NULL OR p.pet_friendly = :petFriendly)
          AND (:instantBook IS NULL OR p.instant_book = :instantBook)
          AND (:superhost IS NULL OR p.superhost = :superhost)
          AND (:region IS NULL OR LOWER(p.region::text) = LOWER(:region::text))
          AND (:propertyType IS NULL OR LOWER(p.property_type::text) LIKE LOWER(CONCAT('%', :propertyType, '%')))
        ORDER BY p.superhost DESC
        """, 
        countQuery = """
        SELECT COUNT(p.id) FROM properties p
        WHERE (:hostId IS NULL OR p.host_id = :hostId)
          AND (:location IS NULL OR LOWER(p.city::text) LIKE LOWER(CONCAT('%', :location, '%'))
                                   OR LOWER(p.state::text) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:minPrice IS NULL OR p.price_per_night >= :minPrice)
          AND (:maxPrice IS NULL OR p.price_per_night <= :maxPrice)
          AND (:minRating IS NULL OR p.average_rating >= :minRating)
          AND (:petFriendly IS NULL OR p.pet_friendly = :petFriendly)
          AND (:instantBook IS NULL OR p.instant_book = :instantBook)
          AND (:superhost IS NULL OR p.superhost = :superhost)
          AND (:region IS NULL OR LOWER(p.region::text) = LOWER(:region::text))
          AND (:propertyType IS NULL OR LOWER(p.property_type::text) LIKE LOWER(CONCAT('%', :propertyType, '%')))
        """)
    Page<Property> searchProperties(
            @Param("hostId") Long hostId,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") BigDecimal minRating,
            @Param("petFriendly") Boolean petFriendly,
            @Param("instantBook") Boolean instantBook,
            @Param("superhost") Boolean superhost,
            @Param("region") String region,
            @Param("propertyType") String propertyType,
            Pageable pageable);
}
