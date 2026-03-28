package com.heavenhub.repositories;

import com.heavenhub.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Hey future me, extending JpaRepository gives us basic CRUD operations automatically!
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring Data JPA magically writes the SQL query for this method based on the name!
    // Equivalent to: SELECT * FROM users WHERE email = :email
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
