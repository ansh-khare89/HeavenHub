package com.heavenhub.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private Long propertyId;
    private String propertyTitle;
    private String content;
    private LocalDateTime sentAt;
}
