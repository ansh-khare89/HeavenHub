package com.heavenhub.services.impl;

import com.heavenhub.dtos.ReviewCreateDto;
import com.heavenhub.dtos.ReviewDto;
import com.heavenhub.dtos.ReviewReplyDto;
import com.heavenhub.exceptions.ResourceNotFoundException;
import com.heavenhub.models.Property;
import com.heavenhub.models.Review;
import com.heavenhub.models.User;
import com.heavenhub.repositories.PropertyRepository;
import com.heavenhub.repositories.ReviewRepository;
import com.heavenhub.repositories.UserRepository;
import com.heavenhub.services.ReviewService;
import com.heavenhub.utils.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> listForProperty(Long propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new ResourceNotFoundException("Property", "id", propertyId);
        }
        return reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId).stream()
                .map(dtoMapper::toReviewDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewDto create(Long propertyId, ReviewCreateDto dto) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
        User guest = userRepository.findById(dto.getGuestId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getGuestId()));

        Review review = new Review();
        review.setProperty(property);
        review.setGuest(guest);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        return dtoMapper.toReviewDto(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public ReviewDto reply(Long reviewId, ReviewReplyDto dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        if (!review.getProperty().getHost().getId().equals(dto.getHostId())) {
            throw new IllegalArgumentException("Only the listing host can reply to this review.");
        }
        review.setHostReply(dto.getReply());
        return dtoMapper.toReviewDto(reviewRepository.save(review));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> listForHost(Long hostId) {
        return reviewRepository.findByHostIdOrderByCreatedAtDesc(hostId).stream()
                .map(dtoMapper::toReviewDto)
                .collect(Collectors.toList());
    }
}
