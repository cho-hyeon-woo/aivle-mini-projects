package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.StarScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface StarScoreRepository extends JpaRepository<StarScore, Long> {
    
    Optional<StarScore> findByUserIdAndBookId(Long userId, Long bookId);
    void deleteByUserId(Long userId);
    @Query("SELECT AVG(s.score) FROM StarScore s WHERE s.bookId = :bookId")
    Double getAverageScoreByBookId(@Param("bookId") Long bookId);
    @Query("SELECT s.bookId, AVG(s.score) as avgScore, COUNT(s.starId) as cnt " +
           "FROM StarScore s GROUP BY s.bookId " +
           "ORDER BY avgScore DESC, cnt DESC, s.bookId ASC")
    List<Object[]> findBookRanking();
}