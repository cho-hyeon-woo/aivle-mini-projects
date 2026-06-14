package com.aivle.bookapp.exception;

public class TagNotFoundException extends RuntimeException {

    public TagNotFoundException(Long TagId) {
        super("태그를 찾을 수 없습니다. TagId = " + TagId);
    }
}
