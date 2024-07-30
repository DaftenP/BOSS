package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.dto.adminDto.AdminReturnDto;
import com.ssafy.BOSS.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String adminLoginId, @RequestParam String adminLoginPw) {
        log.info("AdminController::login");
        log.info("adminLoginId: {}", adminLoginId);
        log.info("adminLoginPw: {}", adminLoginPw);
        try {
            Admin admin = adminService.login(adminLoginId, adminLoginPw);
            if(admin != null) {
                AdminReturnDto adminReturnDto = new AdminReturnDto();
                adminReturnDto.setAdminId(adminLoginId);
                adminReturnDto.setAdminPw(adminLoginPw);
                return ResponseEntity.ok(adminReturnDto);
            } else {
                return ResponseEntity.noContent().build();
            }
        }
        catch(Exception e) {
            return exceptionHandling(e);
        }
    }

    private ResponseEntity<String> exceptionHandling(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body("Sorry: " + e.getMessage());
    }
}
