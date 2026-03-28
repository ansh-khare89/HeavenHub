package com.heavenhub.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private Long guestId;
    private String guestFirstName;
    private Integer rating;
    private String comment;
    private String hostReply;
    private LocalDateTime createdAt;
}
