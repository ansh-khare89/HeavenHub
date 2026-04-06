package com.heavenhub.services;

import com.heavenhub.dtos.MessageDto;
import com.heavenhub.models.Message;
import com.heavenhub.models.Property;
import com.heavenhub.models.User;
import com.heavenhub.repositories.MessageRepository;
import com.heavenhub.repositories.PropertyRepository;
import com.heavenhub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public MessageDto sendMessage(Long senderId, Long receiverId, Long propertyId, String content) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        Property property = propertyRepository.findById(propertyId).orElseThrow();

        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setProperty(property);
        msg.setContent(content);

        msg = messageRepository.save(msg);
        return mapToDto(msg);
    }

    public List<MessageDto> getThread(Long currentUserId, Long otherUserId, Long propertyId) {
        return messageRepository.findThread(currentUserId, otherUserId, propertyId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getInboxSummary(Long userId) {
        List<Message> allMessages = messageRepository.findAllByUserId(userId);

        // Group by 'Thread Key' : propertyId + partnerId
        Map<String, List<Message>> threads = new HashMap<>();
        for (Message m : allMessages) {
            Long partnerId = m.getSender().getId().equals(userId) ? m.getReceiver().getId() : m.getSender().getId();
            String key = m.getProperty().getId() + "-" + partnerId;
            threads.computeIfAbsent(key, k -> new ArrayList<>()).add(m);
        }

        List<Map<String, Object>> inbox = new ArrayList<>();
        for (List<Message> threadMsgs : threads.values()) {
            // Get latest message
            Message latest = threadMsgs.get(threadMsgs.size() - 1);
            Long partnerId = latest.getSender().getId().equals(userId) ? latest.getReceiver().getId() : latest.getSender().getId();
            User partner = latest.getSender().getId().equals(userId) ? latest.getReceiver() : latest.getSender();

            Map<String, Object> summary = new HashMap<>();
            summary.put("propertyId", latest.getProperty().getId());
            summary.put("propertyTitle", latest.getProperty().getTitle());
            summary.put("partnerId", partnerId);
            summary.put("partnerName", partner.getFirstName() + " " + partner.getLastName());
            summary.put("latestMessage", latest.getContent());
            summary.put("latestTime", latest.getSentAt());
            
            inbox.add(summary);
        }

        // Sort inbox by latest time descending
        inbox.sort((a, b) -> {
            java.time.LocalDateTime timeA = (java.time.LocalDateTime) a.get("latestTime");
            java.time.LocalDateTime timeB = (java.time.LocalDateTime) b.get("latestTime");
            return timeB.compareTo(timeA);
        });

        return inbox;
    }

    private MessageDto mapToDto(Message m) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getFirstName() + " " + m.getSender().getLastName());
        dto.setReceiverId(m.getReceiver().getId());
        dto.setReceiverName(m.getReceiver().getFirstName() + " " + m.getReceiver().getLastName());
        dto.setPropertyId(m.getProperty().getId());
        dto.setPropertyTitle(m.getProperty().getTitle());
        dto.setContent(m.getContent());
        dto.setSentAt(m.getSentAt());
        return dto;
    }
}
