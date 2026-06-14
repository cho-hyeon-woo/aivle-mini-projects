package com.aivle.bookapp.dto;

public record UserUpdateRequest(
        String password,
        String name
) {
}
