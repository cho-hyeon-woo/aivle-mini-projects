package com.aivle.bookapp.service;


import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.exception.BookNotFoundException;
import com.aivle.bookapp.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional

public class BookService{
    private final BookRepository bookRepository;

    // 전체 도서 목록 조회 - 홈 화면 도서
    @Transactional(readOnly = true)
    public List<Book> getAllBooks(){
        return bookRepository.findAll();
    }

    // 도서 조회 - 조회한 도서
    @Transactional(readOnly = true)
    public Book findById(Long id){
        return bookRepository.findById(id).orElseThrow(()
                ->new BookNotFoundException(id));
    }
    // 도서 등록
    public Book createBook(Book book){
        book.setCreatedAt(LocalDateTime.now());
        book.setUpdatedAt(LocalDateTime.now());
        return bookRepository.save(book);
    }

    //도서 수정
    public Book updateBook(Long id, Book book){
        Book existing = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        if (book.getTitle() != null) {
            existing.setTitle(book.getTitle());
        }        if (book.getAuthor() != null) {
            existing.setAuthor(book.getAuthor());
        }        if (book.getContent() != null) {
            existing.setContent(book.getContent());
        }        if (book.getCoverImageUrl() != null) {
            existing.setCoverImageUrl(book.getCoverImageUrl());
        }        if (book.getGenre() != null) {
            existing.setGenre(book.getGenre());
        }        if (book.getStyle() != null) {
            existing.setStyle(book.getStyle());
        }
        existing.setUpdatedAt(LocalDateTime.now());
        return bookRepository.save(existing);
    }

    //도서 삭제
    public void deleteBook(Long id){
        bookRepository.findById(id).orElseThrow(()
                -> new BookNotFoundException(id));
        bookRepository.deleteById(id);
    }

    // 이미지 URL 등록
    public Book updateCoverImage(Long id, String coverImageUrl) {
        Book existing = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        existing.setCoverImageUrl(coverImageUrl);
        return bookRepository.save(existing);
    }

    // 내 도서 목록 조회 - 마이페이지용
    @Transactional(readOnly = true)
    public List<Book> findUserId(Long userId){
        return bookRepository.findAll().stream()
                .filter(b->b.getUserId() != null && b.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Book> findByTag(String tag) {
        return bookRepository.findByTagsContaining(tag);
    }
}
