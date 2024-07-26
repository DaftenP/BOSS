package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.domain.LoginLog;
import com.ssafy.BOSS.dto.adminDto.AdminReturnDto;
import com.ssafy.BOSS.repository.AdminLogRepository;
import com.ssafy.BOSS.service.AdminLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/adminlog")
public class AdminLogController {

    private final AdminLogService adminLogService;

    @GetMapping
    public ResponseEntity<?> getLoginLog() {
        List<LoginLog> loginLogs = adminLogService.findAll();
        return ResponseEntity.ok(loginLogs);
    }
}
