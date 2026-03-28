package com.heavenhub.controllers;

import com.heavenhub.dtos.BookingDto;
import com.heavenhub.dtos.BookingRequestDto;
import com.heavenhub.services.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDto> createBooking(@Valid @RequestBody BookingRequestDto dto) {
        return new ResponseEntity<>(bookingService.createBooking(dto), HttpStatus.CREATED);
    }

    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<BookingDto>> listForGuest(@PathVariable Long guestId) {
        return ResponseEntity.ok(bookingService.getBookingsForGuest(guestId));
    }

    @GetMapping("/host/{hostId}/pending")
    public ResponseEntity<List<BookingDto>> listPendingForHost(@PathVariable Long hostId) {
        return ResponseEntity.ok(bookingService.getPendingForHost(hostId));
    }

    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<BookingDto>> listForHost(@PathVariable Long hostId) {
        return ResponseEntity.ok(bookingService.getBookingsForHost(hostId));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingDto> approve(@PathVariable Long id, @RequestParam Long hostId) {
        return ResponseEntity.ok(bookingService.approveBooking(id, hostId));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingDto> reject(@PathVariable Long id, @RequestParam Long hostId) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, hostId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingDto> cancel(@PathVariable Long id, @RequestParam Long guestId) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, guestId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingDto> complete(@PathVariable Long id, @RequestParam Long hostId) {
        return ResponseEntity.ok(bookingService.completeBooking(id, hostId));
    }
}
