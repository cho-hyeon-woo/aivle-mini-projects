package com.aivle.bookapp.exception;

public class ExternalApiException extends RuntimeException {

    public ExternalApiException (){
        super("OpenAI API 키가 잘못되었거나, OpenAI 서버 자체가 다운되어서 표지 이미지를 생성할 수 없습니다.");
    }
}