package com.heavenhub.repositories;

import com.heavenhub.models.Booking;
import com.heavenhub.models.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByGuestIdOrderByCreatedAtDesc(Long guestId);

    List<Booking> findByPropertyId(Long propertyId);

    List<Booking> findByProperty_Host_IdAndStatusOrderByCreatedAtDesc(Long hostId, BookingStatus status);

    List<Booking> findByProperty_Host_Id(Long hostId);

    List<Booking> findByProperty_Host_IdOrderByCreatedAtDesc(Long hostId);
}
