package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.exception.BussinessException;
import com.ssafy.BOSS.exception.ErrorCode;
import com.ssafy.BOSS.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin login(String adminLoginId, String adminLoginPw) {
        Optional<Admin> admin = adminRepository.findByAdminIdAndAdminPw(adminLoginId, adminLoginPw);
        if(admin.isPresent()) {
            return admin.get();
        }
        else {
            return null;
        }
    }
}
