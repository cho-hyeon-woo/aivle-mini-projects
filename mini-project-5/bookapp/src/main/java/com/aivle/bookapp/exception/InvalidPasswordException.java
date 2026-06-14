package com.aivle.bookapp.exception;

public class InvalidPasswordException extends RuntimeException {

    public InvalidPasswordException (){
        super("비밀 번호가 일치하지 않습니다.");
    }
}