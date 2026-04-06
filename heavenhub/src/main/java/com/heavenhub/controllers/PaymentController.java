package com.heavenhub.controllers;

import com.heavenhub.dtos.PaymentOrderResponse;
import com.heavenhub.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createOrder(@RequestParam Long bookingId, @RequestParam Long guestId) {
        return ResponseEntity.ok(paymentService.createOrderForBooking(bookingId, guestId));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        // Warning: This signature verification in production should be more robust
        boolean isSuccess = paymentService.verifyPaymentAndUpdateBooking(payload);
        if (isSuccess) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Verification failed"));
        }
    }
}
