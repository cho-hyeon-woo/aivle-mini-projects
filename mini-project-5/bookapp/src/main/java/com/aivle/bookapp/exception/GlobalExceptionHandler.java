package com.aivle.bookapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(BookNotFoundException e) {
        Map<String, String> body = Map.of("error", "Book not found", "message", e.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldError().getDefaultMessage();
        Map<String, String> body = Map.of("error", "Validation failed", "message", msg);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // 1. 유저를 찾을 수 없을 때 (404 Not Found)
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException e) {
        Map<String, String> body = Map.of("error", "USER_NOT_FOUND", "message", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // 2. 아이디가 중복될 때 (409 Conflict)
    @ExceptionHandler(DuplicateLoginIdException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateLoginId(DuplicateLoginIdException e) {
        Map<String, String> body = Map.of("error", "DUPLICATE_LOGIN_ID", "message", e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // 3. 비밀번호가 틀렸을 때 (401 Unauthorized)
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<Map<String, String>> handleInvalidPassword(InvalidPasswordException e) {
        Map<String, String> body = Map.of("error", "INVALID_PASSWORD", "message", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    // 4. 권한이 없을 때 (403 Forbidden - 남의 책 삭제 시도 등)
    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorizedAccess(UnauthorizedAccessException e) {
        Map<String, String> body = Map.of("error", "UNAUTHORIZED_ACCESS", "message", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // 5. 외부 API 통신 실패 시 (500 Internal Server Error)
    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<Map<String, String>> handleExternalApi(ExternalApiException e) {
        Map<String, String> body = Map.of("error", "EXTERNAL_API_ERROR", "message", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
