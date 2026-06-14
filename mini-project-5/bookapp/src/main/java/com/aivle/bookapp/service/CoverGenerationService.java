package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.CoverGeneration;
import com.aivle.bookapp.repository.CoverGenerationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional

public class CoverGenerationService {

    private final CoverGenerationRepository coverGenerationRepository;

    // AI 표지 생성 - 생성 및 설정값 저장
    public CoverGeneration generateCover(CoverGeneration coverGeneration) {

        // TODO 1: 생성 요청 시작 상태 설정
        // OpenAI API 응답을 기다리는 동안 "생성 중" 상태 저장
        coverGeneration.setStatus("PENDING");

        // TODO 2: 생성 요청 시각 저장
        // 나중에 completed_at과 비교해서 생성 소요 시간 계산에 사용
        coverGeneration.setCreatedAt(LocalDateTime.now());

        try {
            // TODO 3: OpenAI API 호출 구현 예정
            coverGeneration.getImageModel();   //: 사용할 AI 모델 (ex. gpt-image-2)
            coverGeneration.getImageQuality(); // 이미지 품질 (ex. low, medium,high)
            coverGeneration.getOutputFormat(); // 이미지 형식 (ex. png)
            coverGeneration.getCoverStyle();  // 표지 스타일 (ex. 웹툰, 애니메이션, 일러스트 등 )
            coverGeneration.getPrompt();       // 표지 생성에 사용할 텍스트 프롬프트

            // TODO 4: OpenAI API 구현 후 아래 주석 해제
            coverGeneration.setStatus("COMPLETED");
            coverGeneration.setCompletedAt(LocalDateTime.now());

        } catch (Exception e) {
            // TODO 5: OpenAI API 호출 실패 시 처리
            // API Key 오류, 네트워크 오류, 잔액 부족 등
            coverGeneration.setStatus("FAILED");
        }

        return coverGenerationRepository.save(coverGeneration);
    }
}