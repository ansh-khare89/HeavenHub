package com.heavenhub.services.impl;

import com.heavenhub.dtos.BookingDto;
import com.heavenhub.dtos.BookingRequestDto;
import com.heavenhub.dtos.PricingEstimateResponseDto;
import com.heavenhub.exceptions.ResourceNotFoundException;
import com.heavenhub.models.Booking;
import com.heavenhub.models.BookingStatus;
import com.heavenhub.models.Property;
import com.heavenhub.models.User;
import com.heavenhub.repositories.BookingRepository;
import com.heavenhub.repositories.PropertyRepository;
import com.heavenhub.repositories.UserRepository;
import com.heavenhub.services.BookingService;
import com.heavenhub.services.PricingCalculator;
import com.heavenhub.utils.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;
    private final PricingCalculator pricingCalculator;

    @Override
    @Transactional
    public BookingDto createBooking(BookingRequestDto dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", dto.getPropertyId()));
        User guest = userRepository.findById(dto.getGuestId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getGuestId()));

        if (dto.getNumberOfGuests() > property.getMaxGuests()) {
            throw new IllegalArgumentException("Too many guests for this property.");
        }

        long nights = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate());
        if (nights < 1) {
            throw new IllegalArgumentException("Stay must be at least one night.");
        }

        PricingEstimateResponseDto pricing = pricingCalculator.compute(property, dto.getStartDate(), dto.getEndDate());

        Booking booking = new Booking();
        booking.setProperty(property);
        booking.setGuest(guest);
        booking.setStartDate(dto.getStartDate());
        booking.setEndDate(dto.getEndDate());
        booking.setNumberOfGuests(dto.getNumberOfGuests());
        booking.setTotalPrice(pricing.getTotal());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return dtoMapper.toBookingDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDto> getBookingsForGuest(Long guestId) {
        return bookingRepository.findByGuestIdOrderByCreatedAtDesc(guestId).stream()
                .map(dtoMapper::toBookingDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDto> getPendingForHost(Long hostId) {
        return bookingRepository.findByProperty_Host_IdAndStatusOrderByCreatedAtDesc(hostId, BookingStatus.PENDING).stream()
                .map(dtoMapper::toBookingDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDto> getBookingsForHost(Long hostId) {
        return bookingRepository.findByProperty_Host_IdOrderByCreatedAtDesc(hostId).stream()
                .map(dtoMapper::toBookingDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingDto approveBooking(Long bookingId, Long hostId) {
        Booking booking = loadBookingForHost(bookingId, hostId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be approved.");
        }
        booking.setStatus(BookingStatus.ACCEPTED);
        return dtoMapper.toBookingDto(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingDto rejectBooking(Long bookingId, Long hostId) {
        Booking booking = loadBookingForHost(bookingId, hostId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be rejected.");
        }
        booking.setStatus(BookingStatus.REJECTED);
        return dtoMapper.toBookingDto(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingDto cancelBooking(Long bookingId, Long guestId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        if (!booking.getGuest().getId().equals(guestId)) {
            throw new IllegalArgumentException("You can only cancel your own bookings.");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending bookings can be cancelled.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return dtoMapper.toBookingDto(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingDto completeBooking(Long bookingId, Long hostId) {
        Booking booking = loadBookingForHost(bookingId, hostId);
        if (booking.getStatus() != BookingStatus.PAID) {
            throw new IllegalArgumentException("Only paid stays can be marked completed.");
        }
        booking.setStatus(BookingStatus.COMPLETED);
        return dtoMapper.toBookingDto(bookingRepository.save(booking));
    }

    private Booking loadBookingForHost(Long bookingId, Long hostId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        if (!booking.getProperty().getHost().getId().equals(hostId)) {
            throw new IllegalArgumentException("You can only manage bookings for your own properties.");
        }
        return booking;
    }
}
