package com.heavenhub.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponse {
    private String orderId;
    private String currency;
    private Integer amount; // in smallest currency unit, e.g. paise
    private String razorpayKeyId;
}
