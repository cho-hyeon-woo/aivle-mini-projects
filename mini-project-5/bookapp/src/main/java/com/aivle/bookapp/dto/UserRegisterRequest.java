package com.aivle.bookapp.dto;

import com.aivle.bookapp.domain.User;
import jakarta.validation.constraints.NotBlank;

public record UserRegisterRequest(
        @NotBlank String loginId,
        @NotBlank String password,
        @NotBlank String name
) {
    public User toEntity() {
        User user = new User();
        user.setLoginId(loginId);
        user.setPassword(password);
        user.setName(name);
        return user;
    }
}
