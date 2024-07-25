package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogSpecifiedDto;
import com.ssafy.BOSS.repository.EnteringLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class EnteringLogService {

    private final EnteringLogRepository enteringLogRepository;

    public Page<EnteringLog> getEnteringLogs(EnteringLogSpecifiedDto dto, Pageable pageable) {
        return enteringLogRepository.getEnteringLogs(dto, pageable);
    }

}
