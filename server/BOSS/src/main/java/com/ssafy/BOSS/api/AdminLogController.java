package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.domain.LoginLog;
import com.ssafy.BOSS.dto.adminDto.AdminLogDto;
import com.ssafy.BOSS.service.AdminLogService;
import com.ssafy.BOSS.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/log")
public class AdminLogController {

    private final AdminLogService adminLogService;
    private final AdminService adminService;

    @GetMapping("check")
    public ResponseEntity<?> getLoginLog() {
        List<AdminLogDto> loginLogs = adminLogService.findAll();
        return ResponseEntity.ok(loginLogs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminLogById(@PathVariable String name) {
        Admin admin = adminService.findByName(name);
        List<LoginLog> loginLogs = adminLogService.findByAdmin(admin);
        return ResponseEntity.ok(loginLogs);
    }

    @PutMapping("/regist")
    public ResponseEntity<?> regist(@RequestBody AdminLogDto admin) {
        adminLogService.regist(admin);
        return ResponseEntity.ok().build();
    }
}
