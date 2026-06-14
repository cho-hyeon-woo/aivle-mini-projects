package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.dto.UserUpdateRequest;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.aivle.bookapp.exception.DuplicateLoginIdException;
import com.aivle.bookapp.exception.InvalidPasswordException;
import com.aivle.bookapp.exception.UserNotFoundException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    @Transactional
    public User register(User user) {
        if (userRepository.existsByLoginId(user.getLoginId())) {
            throw new DuplicateLoginIdException(user.getLoginId());
        }
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> findByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 로그인
    @Transactional(readOnly = true)
    public User login(String loginId, String password) {
        User user = userRepository.findFirstByLoginId(loginId)
                .orElseThrow(() -> new UserNotFoundException(loginId));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException();
        }

        return user;
    }

    // 회원 정보 조회
    @Transactional(readOnly = true)
    public User getUserById(String userId) {
        return userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    // 회원 정보 수정
    @Transactional
    public User updateUer(String userId, UserUpdateRequest user) {
        User existing = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new UserNotFoundException(userId));
                
        if (user.name() != null && !user.name().isBlank()) {
            existing.setName(user.name());
        }
        if (user.password() != null && !user.password().isBlank()) {
            existing.setPassword(passwordEncoder.encode(user.password()));
        }

        return userRepository.save(existing);
    }

    // 회원 탈퇴
    @Transactional
    public void deleteUser(String userId) {
        userRepository.deleteById(Long.parseLong(userId));
    }
}
