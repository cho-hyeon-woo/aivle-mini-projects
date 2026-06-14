package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Tag;
import com.aivle.bookapp.exception.TagNotFoundException;
import com.aivle.bookapp.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional

public class TagService {
    private final TagRepository tagRepository;

    // 태그 검색
    @Transactional(readOnly = true)
    public List<Tag> findByTagName (String tagName) {
        return tagRepository.findByTagName(tagName);
    }

    // 태그 조회
    @Transactional(readOnly = true)
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    // 태그 추가
    public Tag createTag(Tag tag){
        return tagRepository.save(tag);
    }

    // 태그 삭제
    public void deleteTag(Long tagId){
        tagRepository.findById(tagId).orElseThrow(()
                -> new TagNotFoundException(tagId));
        tagRepository.deleteById(tagId);
    }
}
