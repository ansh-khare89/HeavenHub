package com.heavenhub.utils;

import com.heavenhub.dtos.*;
import com.heavenhub.models.*;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {
    public UserDto toUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        if (user.getTrustScore() != null) {
            dto.setTrustScore(user.getTrustScore().getScore());
        }
        return dto;
    }
    
    public PropertyDto toPropertyDto(Property prop) {
        PropertyDto dto = new PropertyDto();
        dto.setId(prop.getId());
        dto.setTitle(prop.getTitle());
        dto.setDescription(prop.getDescription());
        dto.setAddress(prop.getAddress());
        dto.setCity(prop.getCity());
        dto.setState(prop.getState());
        dto.setZipCode(prop.getZipCode());
        dto.setPricePerNight(prop.getPricePerNight());
        dto.setCleaningFee(prop.getCleaningFee());
        dto.setPlatformFeePercent(prop.getPlatformFeePercent());
        dto.setAverageRating(prop.getAverageRating());
        dto.setHouseManual(prop.getHouseManual());
        dto.setMaxGuests(prop.getMaxGuests());
        dto.setHostId(prop.getHost().getId());
        dto.setPropertyType(prop.getPropertyType());
        dto.setBedrooms(prop.getBedrooms());
        dto.setBathrooms(prop.getBathrooms());
        dto.setAmenities(prop.getAmenities());
        dto.setRegion(prop.getRegion());
        dto.setInstantBook(prop.isInstantBook());
        dto.setPetFriendly(prop.isPetFriendly());
        dto.setSuperhost(prop.isSuperhost());
        dto.setReviewCount(prop.getReviewCount());
        dto.setLatitude(prop.getLatitude());
        dto.setLongitude(prop.getLongitude());
        return dto;
    }

    public BookingDto toBookingDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setPropertyId(booking.getProperty().getId());
        dto.setPropertyTitle(booking.getProperty().getTitle());
        dto.setPropertyCity(booking.getProperty().getCity());
        dto.setGuestId(booking.getGuest().getId());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus().name());
        return dto;
    }

    public ReviewDto toReviewDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setPropertyId(review.getProperty().getId());
        dto.setPropertyTitle(review.getProperty().getTitle());
        dto.setGuestId(review.getGuest().getId());
        dto.setGuestFirstName(review.getGuest().getFirstName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setHostReply(review.getHostReply());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
