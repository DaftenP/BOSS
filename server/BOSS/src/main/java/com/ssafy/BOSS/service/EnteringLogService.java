package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogDto;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogRegistDto;
import com.ssafy.BOSS.dto.enteringLog.RequestEnteringLogDto;
import com.ssafy.BOSS.exception.BossException;
import com.ssafy.BOSS.exception.errorCode.MemberErrorCode;
import com.ssafy.BOSS.mapper.EnteringLogMapper;
import com.ssafy.BOSS.repository.EnteringLogRepository;
import com.ssafy.BOSS.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
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
    private final EnteringLogMapper enteringLogMapper;

    @Transactional
    public void updateEnteringLog(Long logId, int stickerCount, int issue) {
        EnteringLog enteringLog = enteringLogRepository.findById(logId).orElse(null);
        enteringLog.setStickerCount(stickerCount);
        enteringLog.setIssue(issue);
    }

    public List<EnteringLog> findLogsByMember(Member member) {
        return enteringLogRepository.findEnteringLogsByMember(member);
    }

    @Transactional
    public EnteringLogDto save(EnteringLogRegistDto enteringLogRegistDto, MultipartFile deviceFrontImage, MultipartFile deviceBackImage) {
        Member member = memberRepository.findById(enteringLogRegistDto.getMemberId()).orElseThrow(() -> new BossException(MemberErrorCode.MEMBER_NOT_FOUND));
        // 이미지 업로드
        String deviceFrontImageLink = s3UploadService.upload(deviceFrontImage);
        String deviceBackImageLink = s3UploadService.upload(deviceBackImage);
        EnteringLog enteringLog = enteringLogMapper.enteringLogRegistDtoToEnteringLog(enteringLogRegistDto, member, deviceFrontImageLink, deviceBackImageLink);
        enteringLog = enteringLogRepository.save(enteringLog);

        if (enteringLog.getIssue() == 1) {
            member.setIssueCount(member.getIssueCount() + 1);
        }

        return enteringLogMapper.enteringLogToEnteringLogDto(enteringLog);
    }

    @Transactional(readOnly = true)
    public List<EnteringLogDto> getAllEnteringLogs() {
        List<EnteringLog> logs = enteringLogRepository.findAll();
        return logs.stream().map(enteringLogMapper::enteringLogToEnteringLogDto).toList();
    }

    public List<EnteringLogDto> getAllSearchEnteringLogs(RequestEnteringLogDto logDto) {
        List<EnteringLog> logs = enteringLogRepository.searchEnteringLogs(logDto);
        return logs.stream().map(enteringLogMapper::enteringLogToEnteringLogDto).toList();
    }
}
