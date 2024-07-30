package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.domain.LoginLog;
import com.ssafy.BOSS.service.AdminLogService;
import com.ssafy.BOSS.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/log")
public class AdminLogController {

    private final AdminLogService adminLogService;
    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<?> getLoginLog() {
        List<LoginLog> loginLogs = adminLogService.findAll();
        return ResponseEntity.ok(loginLogs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminLogById(@PathVariable String name) {
        Optional<Admin> admin = adminService.findByName(name);
        if (admin.isPresent()) {
            List<LoginLog> loginLogs = adminLogService.findByAdmin(admin);
            return ResponseEntity.ok(loginLogs);
        }
        else {
            return ResponseEntity.notFound().build();
        }

    }
}
