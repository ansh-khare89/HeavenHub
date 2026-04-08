package com.heavenhub.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.heavenhub.models.Property;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    /** Eager-fetch host so filtering / mapping never hits a closed lazy session. */
    @Query("select distinct p from Property p join fetch p.host")
    List<Property> findAllWithHost();

    @Query("select p from Property p join fetch p.host where p.id = :id")
    Optional<Property> findByIdWithHost(Long id);

    // Spring magically creates a WHERE city = ? query here!
    List<Property> findByCity(String city);
    
    // Find all properties owned by a specific host
    List<Property> findByHostId(Long hostId);
}
