package com.heavenhub.repositories;

import com.heavenhub.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);

    @Query("select r from Review r where r.property.host.id = :hostId order by r.createdAt desc")
    List<Review> findByHostIdOrderByCreatedAtDesc(@Param("hostId") Long hostId);
}
