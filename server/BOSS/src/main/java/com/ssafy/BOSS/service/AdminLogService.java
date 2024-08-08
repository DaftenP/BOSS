package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.domain.LoginLog;
import com.ssafy.BOSS.dto.adminDto.AdminLogDto;
import com.ssafy.BOSS.repository.AdminLogRepository;
import com.ssafy.BOSS.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class AdminLogService {

    private final AdminLogRepository adminLogRepository;
    private final AdminRepository adminRepository;

    @Transactional
    public List<AdminLogDto> findAll() {
        List<LoginLog> all = adminLogRepository.findAll();
        return all.stream().map(AdminLogDto::of).toList();
    }

    public List<LoginLog> findByAdmin(Optional<Admin> admin) {
        return adminLogRepository.findByAdmin(admin);
    }

    @Transactional
    public void regist(AdminLogDto loginLog) {
        Optional <Admin> admin = adminRepository.findByAdminName(loginLog.getAdmin().getAdminName());
        if (admin.isPresent()) {
            LoginLog loginLogEntity = new LoginLog();
            loginLogEntity.setAdmin(admin.get());
            adminLogRepository.save(loginLogEntity);
        }
    }
}
