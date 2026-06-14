package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByBookId(Long bookId);
    List<Comment> findByBookIdOrderByCreatedAtDesc(Long bookId);
    void deleteByUserId(Long userId);
}