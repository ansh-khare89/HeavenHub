package com.heavenhub.controllers;

import com.heavenhub.dtos.MessageDto;
import com.heavenhub.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDto> send(@RequestParam Long senderId,
                                           @RequestParam Long receiverId,
                                           @RequestParam Long propertyId,
                                           @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(messageService.sendMessage(senderId, receiverId, propertyId, body.get("content")));
    }

    @GetMapping("/thread")
    public ResponseEntity<List<MessageDto>> getThread(@RequestParam Long user1Id,
                                                      @RequestParam Long user2Id,
                                                      @RequestParam Long propertyId) {
        return ResponseEntity.ok(messageService.getThread(user1Id, user2Id, propertyId));
    }

    @GetMapping("/inbox/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getInbox(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getInboxSummary(userId));
    }
}
