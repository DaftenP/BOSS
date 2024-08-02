package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.dto.adminDto.AdminReturnDto;
import com.ssafy.BOSS.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        try {
            Admin login = adminService.login(admin.getAdminLoginId(), admin.getAdminLoginPw());
            if(login != null) {
                AdminReturnDto adminReturnDto = new AdminReturnDto();
                adminReturnDto.setAdminId(admin.getAdminLoginId());
                adminReturnDto.setAdminPw(admin.getAdminLoginPw());
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
