package com.heavenhub.repositories;

import com.heavenhub.models.PropertyRoast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRoastRepository extends JpaRepository<PropertyRoast, Long> {
    List<PropertyRoast> findAllByOrderByCreatedAtDesc();
}
