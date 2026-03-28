package com.heavenhub.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Hey future me, we use @Entity to map this class to the users table.
 * @Table(name = "users") Plural so we don't conflict with "user" system keywords in standard SQL!
 */
@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstName;
    
    private String lastName;

    private String phoneNumber;

    // EnumType.STRING saves "GUEST" or "HOST" instead of 0 or 1 in the database, making our DB much more readable
    @Enumerated(EnumType.STRING)
    private Role role = Role.GUEST;

    // We link the User to their TrustScore. CascadeType.ALL ensures when a User is created/deleted, 
    // their TrustScore is created/deleted too!
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "trust_score_id", referencedColumnName = "id")
    private TrustScore trustScore;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
