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
     * Eliminates loading all properties into memory.
     */
    @Query("""
        SELECT DISTINCT p FROM Property p
        JOIN FETCH p.host
        WHERE (:hostId IS NULL OR p.host.id = :hostId)
          AND (:location IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :location, '%'))
                                   OR LOWER(p.state) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:minPrice IS NULL OR p.pricePerNight >= :minPrice)
          AND (:maxPrice IS NULL OR p.pricePerNight <= :maxPrice)
          AND (:minRating IS NULL OR p.averageRating >= :minRating)
          AND (:petFriendly IS NULL OR p.petFriendly = :petFriendly)
          AND (:instantBook IS NULL OR p.instantBook = :instantBook)
          AND (:superhost IS NULL OR p.superhost = :superhost)
          AND (:region IS NULL OR LOWER(p.region) = LOWER(:region))
          AND (:propertyType IS NULL OR LOWER(p.propertyType) LIKE LOWER(CONCAT('%', :propertyType, '%')))
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
