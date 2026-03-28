package com.heavenhub.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Hey future me, we use @Entity to tell Hibernate this class maps to a database table.
 * @Table allows us to name the specific table to "trust_scores".
 * @Data is from Lombok and gives us all Getters, Setters, toString, and equals/hashCode for free!
 */
@Entity
@Table(name = "trust_scores")
@Data
public class TrustScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A starting default score
    private Double score = 5.0;

    private Integer numberOfReviews = 0;

    // Important for a platform like Airbnb
    private Boolean verifiedId = false;

    // We map back to the user entity
    @OneToOne(mappedBy = "trustScore")
    private User user;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
