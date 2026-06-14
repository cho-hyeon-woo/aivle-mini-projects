package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.dto.UserLoginRequest;
import com.aivle.bookapp.dto.UserRegisterRequest;
import com.aivle.bookapp.dto.UserResponse;
import com.aivle.bookapp.dto.UserUpdateRequest;
import com.aivle.bookapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aivle.bookapp.repository.BookMarkRepository;
import com.aivle.bookapp.repository.CommentRepository;
import com.aivle.bookapp.repository.StarScoreRepository;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final BookMarkRepository bookMarkRepository;
    private final CommentRepository commentRepository;
    private final StarScoreRepository starScoreRepository;

    @PostMapping
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegisterRequest user) {
        User saved = userService.register(user.toEntity());
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(saved));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers(@RequestParam(required = false) String loginId) {
        List<User> users = loginId != null
                ? userService.findByLoginId(loginId)
                : userService.getAllUsers();

        return ResponseEntity.ok(users.stream()
                .map(UserResponse::from)
                .toList());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest user) {
        User updated = userService.updateUer(userId, user);
        return ResponseEntity.ok(UserResponse.from(updated));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        bookMarkRepository.deleteByUserId(userId);
        commentRepository.deleteByUserId(userId);
        starScoreRepository.deleteByUserId(userId);
        userService.deleteUser(String.valueOf(userId));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody UserLoginRequest loginRequest) {
        User user = userService.login(loginRequest.loginId(), loginRequest.password());
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
