/*package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.CoverGeneration;
import com.aivle.bookapp.service.CoverGenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/covers")
@RequiredArgsConstructor
public class CoverGenerationController {

    private final CoverGenerationService coverGenerationService;

    @PostMapping
    public ResponseEntity<CoverGeneration> generateCover(@Valid @RequestBody CoverGeneration coverGeneration) {
        CoverGeneration createdCover = coverGenerationService.generateCover(coverGeneration);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCover);
    }
}*/