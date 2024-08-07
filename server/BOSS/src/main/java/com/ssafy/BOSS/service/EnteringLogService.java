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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class EnteringLogService {

    private final EnteringLogRepository enteringLogRepository;
    private final MemberRepository memberRepository;
    private final S3UploadService s3UploadService;

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
    public EnteringLog save(EnteringLogRegistDto enteringLogRegistDto, MultipartFile file1, MultipartFile file2) {
        EnteringLog enteringLog = new EnteringLog();
        Optional<Member> member = memberRepository.findById(enteringLogRegistDto.getMemberId());
        if (member.isEmpty()) {
            throw new RuntimeException("Member not found");
        }
        // 이미지 업로드
        String image1 = s3UploadService.upload(file1);
        String image2 = s3UploadService.upload(file2);
        enteringLog.setMember(member.get());
        enteringLog.setDeviceFrontImage(image1);
        enteringLog.setDeviceBackImage(image2);
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
        return logs.stream().map(EnteringLogDto::of).toList();
    }

    public List<EnteringLogDto> getAllSearchEnteringLogs(RequestEnteringLogDto logDto) {
        List<EnteringLog> logs = enteringLogRepository.searchEnteringLogs(logDto);
        return logs.stream().map(EnteringLogDto::of).toList();
    }
}
