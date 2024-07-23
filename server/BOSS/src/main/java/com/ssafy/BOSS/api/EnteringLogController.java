package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogSpecifiedDto;
import com.ssafy.BOSS.service.EnteringLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/loglist")
public class EnteringLogController {

    EnteringLogService enteringLogService;

    @GetMapping
    public ResponseEntity<?> getEnteringLog(@RequestBody EnteringLogSpecifiedDto dto, @RequestBody Pageable pageable) {
        Page<EnteringLog> logs = enteringLogService.getEnteringLogs(dto, pageable);
        return ResponseEntity.ok(logs);
    }


}
