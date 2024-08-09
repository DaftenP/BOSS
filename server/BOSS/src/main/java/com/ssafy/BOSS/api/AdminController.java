package com.ssafy.BOSS.api;

import com.ssafy.BOSS.dto.adminDto.AdminLogDto;
import com.ssafy.BOSS.dto.adminDto.SignInDto;
import com.ssafy.BOSS.dto.jwt.JwtToken;
import com.ssafy.BOSS.service.AdminLogService;
import com.ssafy.BOSS.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AdminLogService adminLogService;

    @PostMapping("/sign-in")
    public JwtToken signIn(@RequestBody SignInDto signInDto) {
        String username = signInDto.getAdminLoginId();
        String password = signInDto.getAdminLoginPw();
        JwtToken jwtToken = adminService.signIn(username, password);
        AdminLogDto adminLogDto = adminService.checkAdmin(username, password);
        adminLogService.regist(adminLogDto);
        log.info("request username = {}, password = {}", username, password);
        log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());
        return jwtToken;
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Admin admin) {
//        try {
//            Admin login = adminService.login(admin.getAdminLoginId(), admin.getAdminLoginPw());
//            if (login != null) {
//                AdminReturnDto adminReturnDto = new AdminReturnDto();
//                adminReturnDto.setAdminId(admin.getAdminLoginId());
//                adminReturnDto.setAdminPw(admin.getAdminLoginPw());
//                adminReturnDto.setAdminName(admin.getAdminName());
//                return ResponseEntity.ok(adminReturnDto);
//            } else {
//                return ResponseEntity.status(401).build();
//            }
//        } catch (Exception e) {
//            return exceptionHandling(e);
//        }
//    }

    private ResponseEntity<String> exceptionHandling(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body("Sorry: " + e.getMessage());
    }
}
