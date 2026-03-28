package com.heavenhub.services;

import com.heavenhub.dtos.ReviewCreateDto;
import com.heavenhub.dtos.ReviewDto;
import com.heavenhub.dtos.ReviewReplyDto;

import java.util.List;

public interface ReviewService {
    List<ReviewDto> listForProperty(Long propertyId);

    ReviewDto create(Long propertyId, ReviewCreateDto dto);

    ReviewDto reply(Long reviewId, ReviewReplyDto dto);

    List<ReviewDto> listForHost(Long hostId);
}
