package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogSpecifiedDto;
import com.ssafy.BOSS.dto.enteringLog.UpdateEnteringLog;
import com.ssafy.BOSS.service.EnteringLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnteringLog(@RequestBody UpdateEnteringLog updateEnteringLog, @PathVariable Long id) {
        enteringLogService.updateEnteringLog(id, updateEnteringLog.getStickerCount(), updateEnteringLog.getIssue());
        return ResponseEntity.ok().build();
    }
}
