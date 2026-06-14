package com.aivle.bookapp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.service.BookMarkService;
import java.util.List;

@RestController
@RequestMapping("/bookmarks")
@RequiredArgsConstructor
public class BookMarkController {
    private final BookMarkService bookMarkService;

    @PostMapping("/bookmarking")
    public ResponseEntity<String> Ismarking(@RequestParam Long userId, @RequestParam Long bookId) {
        boolean ismarked = bookMarkService.Ismarking(userId, bookId);
        
        if (ismarked) {
            return ResponseEntity.ok("북마크가 추가되었습니다.");
        } else {
            return ResponseEntity.ok("북마크가 취소되었습니다.");
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> checkBookmarked(@RequestParam Long userId, @RequestParam Long bookId) {
        boolean isBookmarked = bookMarkService.checkBookmarked(userId, bookId);
        return ResponseEntity.ok(isBookmarked);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Book>> getBookmarkedBooks(@PathVariable Long userId) {
        List<Book> bookmarkedBooks = bookMarkService.getBookmarkedBooks(userId);
        return ResponseEntity.ok(bookmarkedBooks);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Book>> getMyBookmarkedBooks(@RequestParam Long userId) {
        List<Book> books = bookMarkService.getMyBookmarkedBooks(userId);
        return ResponseEntity.ok(books);
    }
}