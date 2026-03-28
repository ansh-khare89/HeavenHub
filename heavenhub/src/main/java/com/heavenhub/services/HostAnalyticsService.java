package com.heavenhub.services;

import com.heavenhub.dtos.HostAnalyticsDto;

public interface HostAnalyticsService {
    HostAnalyticsDto getAnalytics(Long hostId);
}
