package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogDto;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogRegistDto;
import com.ssafy.BOSS.dto.enteringLog.RequestEnteringLogDto;
import com.ssafy.BOSS.dto.enteringLog.UpdateEnteringLog;
import com.ssafy.BOSS.dto.sseDto.SseEmitters;
import com.ssafy.BOSS.exception.BossException;
import com.ssafy.BOSS.exception.errorCode.MemberErrorCode;
import com.ssafy.BOSS.repository.MemberRepository;
import com.ssafy.BOSS.service.EnteringLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/log")
public class EnteringLogController {

    private final MemberRepository memberRepository;
    private final EnteringLogService enteringLogService;
    private final SseEmitters sseEmitters;

    @GetMapping("/view")
    public ResponseEntity<?> getAllEnteringLogs() {
        List<EnteringLogDto> logs = enteringLogService.getAllEnteringLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> getEnteringLogByMemberId(@PathVariable long id) {
        Member member = memberRepository.findById(id).orElseThrow(() -> new BossException(MemberErrorCode.MEMBER_NOT_FOUND));
        List<EnteringLog> logs = enteringLogService.findLogsByMember(member);
        return ResponseEntity.ok(logs);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateEnteringLog(@RequestBody UpdateEnteringLog updateEnteringLog, @PathVariable Long id) {
        enteringLogService.updateEnteringLog(id, updateEnteringLog.getCountOfSticker(), updateEnteringLog.getIssue());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/regist")
    public ResponseEntity<Void> saveEnteringLog(
            @RequestPart(value = "deviceFrontImage", required = false) MultipartFile deviceFrontImage,
            @RequestPart(value = "deviceBackImage", required = false) MultipartFile deviceBackImage,
            @RequestPart(value = "enteringLogRegistDto", required = false) EnteringLogRegistDto enteringLogRegistDto
    ) {
        EnteringLogDto enteringLog = enteringLogService.save(enteringLogRegistDto, deviceFrontImage, deviceBackImage);
        if (enteringLog.getIssue() == 1) {
            sseEmitters.createIssue();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<EnteringLogDto>> searchEnteringLog(@ModelAttribute RequestEnteringLogDto dto) {
        List<EnteringLogDto> logs = enteringLogService.getAllSearchEnteringLogs(dto);
        return ResponseEntity.ok(logs);
    }

}
