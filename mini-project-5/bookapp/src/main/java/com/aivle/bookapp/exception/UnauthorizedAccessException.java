package com.aivle.bookapp.exception;

public class UnauthorizedAccessException extends RuntimeException {

    public UnauthorizedAccessException() {
        super("권한이 존재하지 않습니다!");
    }
}
