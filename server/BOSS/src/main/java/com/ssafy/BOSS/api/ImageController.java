package com.ssafy.BOSS.api;

import com.ssafy.BOSS.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/img")
public class ImageController {

    private final S3UploadService s3UploadService;

    @PostMapping("/upload/{var}")
    public ResponseEntity<?> s3Upload(@RequestPart(value = "image", required = false) MultipartFile image, @PathVariable int var) {
        String profileImage = s3UploadService.upload(image, var);
        return ResponseEntity.ok(profileImage);
    }
}
