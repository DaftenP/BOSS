package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.service.AdminService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("api/admin/login")
    public ResponseEntity<?> login(@RequestParam String adminId, @RequestParam String adminPw) {
        try {
            Admin admin = adminService.login(adminId, adminPw);
            if(admin != null) {
                AdminReturnDto adminReturnDto = new AdminReturnDto();
                adminReturnDto.setAdminId(adminId);
                adminReturnDto.setAdminPw(adminPw);
                return ResponseEntity.ok(adminReturnDto);
            } else {
                return ResponseEntity.noContent().build();
            }
        }
        catch(Exception e) {
            return exceptionHandling(e);
        }
    }

    @Data
    static class AdminReturnDto {
        private String adminId;
        private String adminPw;
    }

    private ResponseEntity<String> exceptionHandling(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body("Sorry: " + e.getMessage());
    }
}
