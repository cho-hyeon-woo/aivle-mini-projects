package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Comment;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.dto.CommentResponse; 
import com.aivle.bookapp.repository.CommentRepository;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public Comment addComment(Long userId, Long bookId, String content) {
        Comment newComment = new Comment();
        newComment.setUserId(userId);
        newComment.setBookId(bookId);
        newComment.setContent(content);
        
        return commentRepository.save(newComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByBookId(Long bookId) {
        List<Comment> comments = commentRepository.findByBookIdOrderByCreatedAtDesc(bookId);
        
        return comments.stream()
                .map(comment -> {
                    User user = userRepository.findById(comment.getUserId()).orElse(null);
                    return new CommentResponse(comment, user);
                })
                .toList();
    }

    public boolean deleteComment(Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        
        if (comment.isPresent()) {
            commentRepository.delete(comment.get());
            return true;
        } else {
            return false;
        }
    }

    @Transactional
    public boolean updateComment(Long commentId, String content) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            comment.setContent(content);
            commentRepository.save(comment);
            return true;
        }
        return false;
    }
}