package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByTagName(String tagName);
}