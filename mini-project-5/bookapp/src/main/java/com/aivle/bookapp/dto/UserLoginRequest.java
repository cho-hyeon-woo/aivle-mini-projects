package com.aivle.bookapp.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginRequest(
        @NotBlank String loginId,
        @NotBlank String password
) {
}
