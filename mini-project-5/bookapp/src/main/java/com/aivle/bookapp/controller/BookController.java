package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {
    
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book saved = bookService.createBook(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/create-test") 
    public ResponseEntity<Book> createBookByUrl(@RequestParam String title, @RequestParam String author, @RequestParam String content) {

        Book newBook = new Book();
        newBook.setTitle(title);
        newBook.setAuthor(author);
        newBook.setContent(content);

        Book saved = bookService.createBook(newBook);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        Book book = bookService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(book);
    }

    @PatchMapping("/{id}/cover")
    public ResponseEntity<Book> updateCoverImage(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String coverImageUrl = request.get("coverImageUrl");
        Book updated = bookService.updateCoverImage(id, coverImageUrl);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Book>> getBooksByUserId(@PathVariable Long userId) {
        List<Book> books = bookService.findUserId(userId);
        return ResponseEntity.status(HttpStatus.OK).body(books);
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(bookService.getAllBooks());
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book updated = bookService.updateBook(id, book);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/update-url")
    public ResponseEntity<Book> updateBookByUrl(
            @RequestParam Long id,
            @RequestParam String title,
            @RequestParam String author,
            @RequestParam String content,
            @RequestParam(required = false) String coverImageUrl) {

        Book updateData = new Book();
        updateData.setTitle(title);
        updateData.setAuthor(author);
        updateData.setContent(content);
        updateData.setCoverImageUrl(coverImageUrl);

        Book updated = bookService.updateBook(id, updateData);

        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/tag/{tag}")
    public ResponseEntity<List<Book>> searchByTag(@PathVariable String tag) {
        return ResponseEntity.ok(bookService.findByTag(tag));
    }


    /*@GetMapping("/books/count")
    public long getCount() {
        return bookService.count();
    }*/

    /*@GetMapping("/books/search/title")
    public List<Book> searchByTitle(@RequestParam String title) {
        return bookService.searchByTitle(title);
    }*/

    /*@GetMapping("/books/search")
    public List<Book> searchByKeyword(@RequestParam String keyword) {
        return bookService.searchByKeyword(keyword);
    }*/

    /*@GetMapping("/books/search/detail")
    public List<Book> searchByTitleAndAuthor(@RequestParam String title, @RequestParam String author) {
        return bookService.searchByTitleAndAuthor(title, author);
    }*/

    /*@GetMapping("/books/search/author")
    public List<String> authorGetTitle(@RequestParam String author) {
        return bookService.authorGetTitle(author);
    }*/

    /*@PostMapping("/books")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book saved = bookService.create(book);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }*/
}













