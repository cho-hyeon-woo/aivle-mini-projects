package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByLoginId(String loginId);
    Optional<User> findFirstByLoginId(String loginId);
    boolean existsByLoginId(String loginId);
}
