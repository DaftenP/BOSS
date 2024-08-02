package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogSpecifiedDto;
import com.ssafy.BOSS.dto.enteringLog.RequestEnteringLogDto;
import com.ssafy.BOSS.dto.enteringLog.UpdateEnteringLog;
import com.ssafy.BOSS.repository.MemberRepository;
import com.ssafy.BOSS.service.EnteringLogService;
import com.ssafy.BOSS.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/log")
public class EnteringLogController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final EnteringLogService enteringLogService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping
    @Deprecated
    public ResponseEntity<?> getEnteringLog(@RequestParam EnteringLogSpecifiedDto dto, @RequestParam Pageable pageable) {
        Page<EnteringLog> logs = enteringLogService.getEnteringLogs(dto, pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/view")
    public ResponseEntity<?> getAllEnteringLogs() {
        List<EnteringLog> logs = enteringLogService.getAllEnteringLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> getEnteringLogByMemberId(@PathVariable long id) {
        Optional<Member> member = memberRepository.findById(id);
        if(member.isPresent()) {
            List<EnteringLog> logs = enteringLogService.findLogsByMember(member);
            return ResponseEntity.ok(logs);
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEnteringLog(@RequestBody UpdateEnteringLog updateEnteringLog, @PathVariable Long id) {
        enteringLogService.updateEnteringLog(id, updateEnteringLog.getStickerCount(), updateEnteringLog.getIssue());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/regist")
    public ResponseEntity<?> saveEnteringLog(@RequestBody EnteringLog enteringLog) {
        enteringLogService.save(enteringLog);
        if(enteringLog.isFail()) {
            messagingTemplate.convertAndSend("/api/topic/log-fail", enteringLog);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchEnteringLog(@ModelAttribute RequestEnteringLogDto dto) {
        enteringLogService.getAllSearchEnteringLogs(dto);
        return ResponseEntity.ok().build();
    }

}
