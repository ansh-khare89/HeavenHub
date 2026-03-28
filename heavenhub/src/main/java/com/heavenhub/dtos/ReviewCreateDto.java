package com.heavenhub.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewCreateDto {
    @NotNull
    private Long guestId;
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
    private String comment;
}
