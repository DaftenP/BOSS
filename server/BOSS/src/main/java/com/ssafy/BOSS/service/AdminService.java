package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.exception.BussinessException;
import com.ssafy.BOSS.exception.ErrorCode;
import com.ssafy.BOSS.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin login(String adminId, String adminPw) {
        Admin admin = adminRepository.findId(adminId);

        if (admin == null) {
            new BussinessException(ErrorCode.MEMBER_NOT_FOUND);
        }
    }
}
