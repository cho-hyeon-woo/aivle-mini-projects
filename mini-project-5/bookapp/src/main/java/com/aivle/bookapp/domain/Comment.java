package com.aivle.bookapp.domain;

import jakarta.persistence.EntityListeners;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import lombok.Setter;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Comment{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long bookId;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String content;

    @CreatedDate
    private LocalDateTime createdAt;
}