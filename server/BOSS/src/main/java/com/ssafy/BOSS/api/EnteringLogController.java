package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogSpecifiedDto;
import com.ssafy.BOSS.dto.enteringLog.UpdateEnteringLog;
import com.ssafy.BOSS.repository.MemberRepository;
import com.ssafy.BOSS.service.EnteringLogService;
import com.ssafy.BOSS.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/loglist")
public class EnteringLogController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    EnteringLogService enteringLogService;

    @GetMapping
    public ResponseEntity<?> getEnteringLog(@RequestBody EnteringLogSpecifiedDto dto, @RequestBody Pageable pageable) {
        Page<EnteringLog> logs = enteringLogService.getEnteringLogs(dto, pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/{id}")
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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnteringLog(@RequestBody UpdateEnteringLog updateEnteringLog, @PathVariable Long id) {
        enteringLogService.updateEnteringLog(id, updateEnteringLog.getStickerCount(), updateEnteringLog.getIssue());
        return ResponseEntity.ok().build();
    }
}
