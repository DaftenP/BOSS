package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.memberDto.MemberReturnDto;
import com.ssafy.BOSS.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/registration")
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

    private ResponseEntity<String> exceptionHandling(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body("Sorry: " + e.getMessage());
    }
}
