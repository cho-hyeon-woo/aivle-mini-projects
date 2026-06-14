package com.aivle.bookapp.domain;

import jakarta.persistence.EntityListeners;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import lombok.Setter;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;


@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"bookId", "userId"})
})
public class StarScore{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long starId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long bookId;

    @Column(nullable = false, columnDefinition = "Integer")
    @Min(1)
    @Max(5)
    private int score;

    @CreatedDate
    private LocalDateTime createdAt;
}