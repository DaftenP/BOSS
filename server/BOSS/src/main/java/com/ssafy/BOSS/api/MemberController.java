package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.memberDto.MemberResponseDto;
import com.ssafy.BOSS.dto.memberDto.MemberReturnDto;
import com.ssafy.BOSS.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/regist")
    public ResponseEntity<?> memberRegiste(@RequestBody Member member) {
        try {
            member = memberService.join(member);
            if(member != null) {
                MemberReturnDto memberReturnDto = new MemberReturnDto();
                memberReturnDto.setMemberProfile(member.getProfileImage());
                memberReturnDto.setMemberName(member.getName());
                memberReturnDto.setDepartment(member.getDepartment());
                memberReturnDto.setPosition(member.getPosition());
                memberReturnDto.setNfc(member.getNfc());
                return ResponseEntity.ok(memberReturnDto);
            } else {
                return ResponseEntity.noContent().build();
            }
        }
        catch(Exception e) {
            return exceptionHandling(e);
        }
    }

    @GetMapping("/{nfc}")
    public ResponseEntity<?> getMemberByNfc(@PathVariable String nfc) {
        Optional<Member> member = memberService.findbyNfc(nfc);
        if(member.isPresent()) {
            MemberResponseDto memberResponseDto = new MemberResponseDto();
            memberResponseDto.setId(member.get().getMemberId());
            memberResponseDto.setMemberProfile(member.get().getProfileImage());
            memberResponseDto.setMemberName(member.get().getName());
            memberResponseDto.setDepartment(member.get().getDepartment());
            memberResponseDto.setPosition(member.get().getPosition());
            memberResponseDto.setIssueCount(member.get().getIssueCount());
            memberResponseDto.setPhoneNumber(member.get().getPhoneNumber());
            return ResponseEntity.ok(memberResponseDto);
        }
        else {
            return ResponseEntity.noContent().build();
        }
    }

    private ResponseEntity<String> exceptionHandling(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body("Sorry: " + e.getMessage());
    }
}
