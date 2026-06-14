package com.aivle.bookapp.exception;

public class DuplicateLoginIdException extends RuntimeException {

    public DuplicateLoginIdException (String loginId){
        super(loginId+ "은(는) 이미 존재하는 id 입니다.");
    }
}