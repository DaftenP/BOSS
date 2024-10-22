package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.dto.adminDto.AdminDto;
import com.ssafy.BOSS.dto.adminDto.AdminLogDto;
import com.ssafy.BOSS.dto.jwt.JwtToken;
import com.ssafy.BOSS.exception.BossException;
import com.ssafy.BOSS.exception.errorCode.AdminErrorCode;
import com.ssafy.BOSS.jwt.JwtTokenProvider;
import com.ssafy.BOSS.mapper.AdminMapper;
import com.ssafy.BOSS.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class AdminService {

    private final AdminRepository adminRepository;

    private final AdminMapper adminMapper;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public JwtToken signIn(String username, String password) {
        // 1. username + password 를 기반으로 Authentication 객체 생성
        // 이때 authentication 은 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        // 2. 실제 검증. authenticate() 메서드를 통해 요청된 Member 에 대한 검증 진행
        // authenticate 메서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드 실행
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        return jwtTokenProvider.generateToken(authentication);
    }

    @Transactional
    public AdminLogDto checkAdmin(String adminLoginId, String adminLoginPw) {
        Admin admin = adminRepository.findByAdminLoginIdAndAdminLoginPw(adminLoginId, adminLoginPw).orElseThrow(() -> new BossException(AdminErrorCode.ADMIN_NOT_FOUND));
        AdminLogDto adminLogDto = new AdminLogDto();
        AdminDto adminDto = adminMapper.adminToAdminDto(admin);
        adminLogDto.setAdmin(adminDto);
        return adminLogDto;
    }

    public Admin findByName(String adminName) {
        return adminRepository.findByAdminName(adminName).orElseThrow(() -> new BossException(AdminErrorCode.ADMIN_NOT_FOUND));
    }
}
