package com.heavenhub.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_roasts")
@Data // From Lombok
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyRoast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String propertyName;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false, length = 1000)
    private String roastText;

    @Column(nullable = true)
    private Long authorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoastLevel roastLevel;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
