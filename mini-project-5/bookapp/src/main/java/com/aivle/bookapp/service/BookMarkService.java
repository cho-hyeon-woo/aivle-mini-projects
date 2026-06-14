package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.BookMark;
import com.aivle.bookapp.repository.BookMarkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class BookMarkService{
    private final BookMarkRepository bookMarkRepository;
    public boolean Ismarking(Long userId, Long bookId){
        Optional<BookMark> existingMark = bookMarkRepository.findByUserIdAndBookId(userId, bookId);

        if (existingMark.isPresent()) {
            bookMarkRepository.delete(existingMark.get());
            return false;
        }
        else {
            BookMark newMark = new BookMark();
            newMark.setUserId(userId);
            newMark.setBookId(bookId);
            
            bookMarkRepository.save(newMark);
            return true;
        }
    }

    public boolean checkBookmarked(Long userId, Long bookId) {
        return bookMarkRepository.existsByUserIdAndBookId(userId, bookId);
    }

    public List<Book> getBookmarkedBooks(Long userId) {
        return bookMarkRepository.getBookmarkedBooks(userId);
    }

    public List<Book> getMyBookmarkedBooks(Long userId) {
        return bookMarkRepository.getBookmarkedBooks(userId);
    }
}