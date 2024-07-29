package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin login(String adminLoginId, String adminLoginPw) {
        Optional<Admin> admin = adminRepository.findByAdminLoginIdAndAdminLoginPw(adminLoginId, adminLoginPw);
        if(admin.isPresent()) {
            return admin.get();
        }
        else {
            return null;
        }
    }

    public Optional<Admin> findByName(String adminName) {
        return adminRepository.findByAdminName(adminName);
    }
}
