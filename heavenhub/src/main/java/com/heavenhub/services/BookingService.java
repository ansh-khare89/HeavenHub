package com.heavenhub.services;

import com.heavenhub.dtos.BookingDto;
import com.heavenhub.dtos.BookingRequestDto;

import java.util.List;

public interface BookingService {
    BookingDto createBooking(BookingRequestDto dto);

    List<BookingDto> getBookingsForGuest(Long guestId);

    List<BookingDto> getPendingForHost(Long hostId);

    List<BookingDto> getBookingsForHost(Long hostId);

    BookingDto approveBooking(Long bookingId, Long hostId);

    BookingDto rejectBooking(Long bookingId, Long hostId);

    BookingDto cancelBooking(Long bookingId, Long guestId);

    BookingDto completeBooking(Long bookingId, Long hostId);
}
