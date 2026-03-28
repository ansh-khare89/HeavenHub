package com.heavenhub.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewReplyDto {
    @NotNull
    private Long hostId;
    @NotBlank
    private String reply;
}
