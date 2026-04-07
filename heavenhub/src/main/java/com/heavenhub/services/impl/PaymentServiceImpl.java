package com.heavenhub.services.impl;

import com.heavenhub.dtos.PaymentOrderResponse;
import com.heavenhub.exceptions.ResourceNotFoundException;
import com.heavenhub.models.Booking;
import com.heavenhub.models.BookingStatus;
import com.heavenhub.repositories.BookingRepository;
import com.heavenhub.services.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final BookingRepository bookingRepository;

    @Value("${payment.razorpay.keyId:dummy}")
    private String razorpayKeyId;

    @Value("${payment.razorpay.keySecret:dummy}")
    private String razorpayKeySecret;

    @Override
    @Transactional
    public PaymentOrderResponse createOrderForBooking(Long bookingId, Long guestId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getGuest().getId().equals(guestId)) {
            throw new IllegalArgumentException("You can only pay for your own bookings.");
        }
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalArgumentException("Only accepted bookings can be paid for.");
        }

        try {
            int amount = booking.getTotalPrice().multiply(new BigDecimal("100")).intValue();

            if ("dummy".equals(razorpayKeyId) || "dummy".equals(razorpayKeySecret)) {
                return new PaymentOrderResponse(
                        "order_dummy_" + bookingId,
                        "INR",
                        amount,
                        razorpayKeyId);
            }

            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_booking_" + bookingId);

            Order order = razorpayClient.orders.create(orderRequest);

            return new PaymentOrderResponse(
                    order.get("id"),
                    "INR",
                    amount,
                    razorpayKeyId);

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public boolean verifyPaymentAndUpdateBooking(Map<String, String> payload) {
        String razorpayOrderId = payload.get("razorpay_order_id");
        String razorpayPaymentId = payload.get("razorpay_payment_id");
        String razorpaySignature = payload.get("razorpay_signature");
        String bookingIdStr = payload.get("booking_id");

        if (razorpayOrderId != null && razorpayOrderId.startsWith("order_dummy_")) {
            if (bookingIdStr != null) {
                Long bookingId = Long.parseLong(bookingIdStr);
                Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
                booking.setStatus(BookingStatus.PAID);
                bookingRepository.save(booking);
                return true;
            }
            return false;
        }

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValid && bookingIdStr != null) {
                Long bookingId = Long.parseLong(bookingIdStr);
                Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
                booking.setStatus(BookingStatus.PAID);
                bookingRepository.save(booking);
                return true;
            }

            return false;

        } catch (RazorpayException e) {
            throw new RuntimeException("Payment verification failed", e);
        }
    }
}