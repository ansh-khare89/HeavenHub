package com.heavenhub.repositories;

import com.heavenhub.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    /** Eager-fetch host so filtering / mapping never hits a closed lazy session. */
    @Query("select distinct p from Property p join fetch p.host")
    List<Property> findAllWithHost();

    // Spring magically creates a WHERE city = ? query here!
    List<Property> findByCity(String city);
    
    // Find all properties owned by a specific host
    List<Property> findByHostId(Long hostId);
}
