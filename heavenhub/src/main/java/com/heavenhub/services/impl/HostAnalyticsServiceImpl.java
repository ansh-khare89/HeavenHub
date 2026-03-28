package com.heavenhub.services.impl;

import com.heavenhub.dtos.HostAnalyticsDto;
import com.heavenhub.models.Booking;
import com.heavenhub.models.BookingStatus;
import com.heavenhub.repositories.BookingRepository;
import com.heavenhub.services.HostAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HostAnalyticsServiceImpl implements HostAnalyticsService {

    private final BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public HostAnalyticsDto getAnalytics(Long hostId) {
        List<Booking> hostBookings = bookingRepository.findByProperty_Host_Id(hostId);

        BigDecimal totalEarnings = hostBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingPayout = hostBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<YearMonth, BigDecimal> byMonth = hostBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.COMPLETED)
                .collect(Collectors.groupingBy(
                        b -> YearMonth.from(b.getEndDate()),
                        TreeMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Booking::getTotalPrice, BigDecimal::add)));

        List<HostAnalyticsDto.MonthlyEarningDto> monthly = new ArrayList<>();
        byMonth.forEach((ym, amt) -> {
            HostAnalyticsDto.MonthlyEarningDto row = new HostAnalyticsDto.MonthlyEarningDto();
            row.setMonth(ym.toString());
            row.setAmount(amt);
            monthly.add(row);
        });
        monthly.sort(Comparator.comparing(HostAnalyticsDto.MonthlyEarningDto::getMonth));

        HostAnalyticsDto dto = new HostAnalyticsDto();
        dto.setTotalEarnings(totalEarnings);
        dto.setPendingPayout(pendingPayout);
        dto.setMonthlyEarnings(monthly);
        return dto;
    }
}
