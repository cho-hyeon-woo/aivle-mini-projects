package com.aivle.bookapp.dto;

import com.aivle.bookapp.domain.User;
import java.time.LocalDateTime;

public record UserResponse(
        Long userId,
        String loginId,
        String name,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getLoginId(),
                user.getName(),
                user.getCreatedAt()
        );
    }
}
