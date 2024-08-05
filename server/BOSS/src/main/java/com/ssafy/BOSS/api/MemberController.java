package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.adminDto.SignInDto;
import com.ssafy.BOSS.dto.jwt.JwtToken;
import com.ssafy.BOSS.dto.memberDto.*;
import com.ssafy.BOSS.service.MemberService;
import com.ssafy.BOSS.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;
    private final S3UploadService s3UploadService;

    @PostMapping("/regist")
    public ResponseEntity<?> memberRegist(@RequestPart(value = "profileImage", required = false)MultipartFile file, @RequestPart(value = "memberRegistDto", required = false) MemberRegistDto memberRegistDto) {
        try {
            MemberDto member = memberService.join(memberRegistDto, file);
            if(member != null) {
                return ResponseEntity.ok(member);
            } else {
                return ResponseEntity.noContent().build();
            }
        }
        catch(Exception e) {
            return exceptionHandling(e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> memberLogin(@RequestBody MemberLoginDto memberLoginDto) {
        MemberLoginDto memberLogin = memberService.login(memberLoginDto);
        if(memberLogin != null) {
            return ResponseEntity.ok(memberLogin);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{nfc}")
    public ResponseEntity<?> getMemberByNfc(@PathVariable String nfc) {
        Optional<Member> member = memberService.findbyNfc(nfc);
        if(member.isPresent()) {
            return ResponseEntity.ok(MemberDto.of(member.get()));
        }
        else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> getMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchMembers(@ModelAttribute RequestMemberDto dto) {
        List<MemberLogDto> memberLogs = memberService.searchMemberLogs(dto);
        if(!memberLogs.isEmpty()) {
            return ResponseEntity.ok(memberLogs);
        }
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<String> exceptionHandling(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body("Sorry: " + e.getMessage());
    }
}
