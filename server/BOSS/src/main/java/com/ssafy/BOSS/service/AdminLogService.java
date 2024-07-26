package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.LoginLog;
import com.ssafy.BOSS.repository.AdminLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class AdminLogService {

    private final AdminLogRepository adminLogRepository;

    public List<LoginLog> findAll() {
        return adminLogRepository.findAll();
    }
}
