package com.heavenhub.services;

import com.heavenhub.dtos.PaymentOrderResponse;
import java.util.Map;

public interface PaymentService {
    PaymentOrderResponse createOrderForBooking(Long bookingId, Long guestId);
    boolean verifyPaymentAndUpdateBooking(Map<String, String> payload);
}
