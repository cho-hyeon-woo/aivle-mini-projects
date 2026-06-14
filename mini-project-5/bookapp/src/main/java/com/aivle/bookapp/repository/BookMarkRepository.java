package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.BookMark;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface BookMarkRepository extends JpaRepository<BookMark, Long> {
    Optional<BookMark> findByUserIdAndBookId(Long userId, Long bookId);
    boolean existsByUserIdAndBookId(Long userId, Long bookId); 
    void deleteByUserId(Long userId);

    @Query("SELECT b FROM Book b WHERE b.id IN (SELECT bm.bookId FROM BookMark bm WHERE bm.userId = :userId)")
    List<Book> getBookmarkedBooks(Long userId);
}
