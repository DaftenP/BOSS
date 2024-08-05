package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogDto;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogRegistDto;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogSpecifiedDto;
import com.ssafy.BOSS.dto.enteringLog.RequestEnteringLogDto;
import com.ssafy.BOSS.repository.EnteringLogRepository;
import com.ssafy.BOSS.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class EnteringLogService {

    private final EnteringLogRepository enteringLogRepository;
    private final MemberRepository memberRepository;

    public Page<EnteringLog> getEnteringLogs(EnteringLogSpecifiedDto dto, Pageable pageable) {
        return enteringLogRepository.getEnteringLogs(dto, pageable);
    }

    @Transactional
    public void updateEnteringLog(Long logId, int stickerCount, int issue) {
        EnteringLog enteringLog = enteringLogRepository.findById(logId).orElse(null);
        enteringLog.setStickerCount(stickerCount);
        enteringLog.setIssue(issue);
    }

    public List<EnteringLog> findLogsByMember(Optional<Member> member) {
        return enteringLogRepository.findEnteringLogsByMember(member);
    }

    @Transactional
    public EnteringLog save(EnteringLogRegistDto enteringLogRegistDto) {
        EnteringLog enteringLog = new EnteringLog();
        Optional<Member> member = memberRepository.findById(enteringLogRegistDto.getMemberId());
        if(member.isEmpty()) {
            throw new RuntimeException("Member not found");
        }
        enteringLog.setMember(member.get());
        enteringLog.setDeviceFrontImage(enteringLogRegistDto.getDeviceFrontImage());
        enteringLog.setDeviceBackImage(enteringLogRegistDto.getDeviceBackImage());
        enteringLog.setEntering(enteringLogRegistDto.getEntering());
        enteringLog.setGateNumber(enteringLogRegistDto.getGateNumber());
        enteringLog.setStickerCount(enteringLogRegistDto.getStickerCount());
        enteringLog.setIssue(enteringLogRegistDto.getIssue());
        enteringLog.setCameraLens(enteringLogRegistDto.getCameraLens());
        enteringLogRepository.save(enteringLog);
        return enteringLog;
    }

    @Transactional(readOnly = true)
    public List<EnteringLogDto> getAllEnteringLogs() {
        List<EnteringLog> logs = enteringLogRepository.findAll();
        return logs.stream().map(log -> {
            EnteringLogDto dto = new EnteringLogDto();
            if (log.getMember() != null) {
                dto.setName(log.getMember().getName());
                if (log.getMember().getPosition() != null) {
                    dto.setPosition(log.getMember().getPosition().getPositionName());
                }
                if (log.getMember().getDepartment() != null) {
                    dto.setDepartment(log.getMember().getDepartment().getDepartmentName());
                }
            }
            dto.setId(log.getLogId());
            dto.setIssue(log.getIssue());
            dto.setTime(log.getTime());
            return dto;
        }).toList();
    }

    public List<EnteringLogDto> getAllSearchEnteringLogs(RequestEnteringLogDto logDto) {
        return enteringLogRepository.searchEnteringLogs(logDto);
    }
}
