package com.aivle.bookapp.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String name) {
        super(name + " 유저를 찾을 수 없습니다.");
    }
}
