package com.aivle.bookapp.dto;

import com.aivle.bookapp.domain.Comment;
import com.aivle.bookapp.domain.User;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResponse {
    private Long commentId;
    private Long userId;
    private Long bookId;
    private String content;
    private LocalDateTime createdAt;
    
    private String userName;
    private String loginId;

    public CommentResponse(Comment comment, User user) {
        this.commentId = comment.getCommentId();
        this.userId = comment.getUserId();
        this.bookId = comment.getBookId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        
        if (user != null) {
            this.userName = user.getName();
            this.loginId = user.getLoginId();
        } else {
            this.userName = "알 수 없는 사용자";
            this.loginId = "unknown";
        }
    }
}