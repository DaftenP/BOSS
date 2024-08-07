package com.ssafy.BOSS.api;

import com.ssafy.BOSS.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/img")
public class ImageController {

    private final S3UploadService s3UploadService;

    @PostMapping("/upload")
    public ResponseEntity<?> s3Upload(@RequestPart(value = "image", required = false) MultipartFile image) {
        String profileImage = s3UploadService.upload(image);
        return ResponseEntity.ok(profileImage);
    }
}
