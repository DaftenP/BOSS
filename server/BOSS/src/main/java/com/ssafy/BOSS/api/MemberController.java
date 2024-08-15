package com.ssafy.BOSS.api;

import com.ssafy.BOSS.dto.memberDto.MemberDto;
import com.ssafy.BOSS.dto.memberDto.MemberLoginDto;
import com.ssafy.BOSS.dto.memberDto.MemberRegistDto;
import com.ssafy.BOSS.dto.memberDto.RequestMemberDto;
import com.ssafy.BOSS.service.MemberService;
import com.ssafy.BOSS.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;
    private final S3UploadService s3UploadService;

    @PostMapping("/regist")
    public ResponseEntity<?> memberRegist(@RequestPart(value = "profileImage", required = false) MultipartFile file, @RequestPart(value = "memberRegistDto", required = false) MemberRegistDto memberRegistDto) {
            MemberDto member = memberService.join(memberRegistDto, file);
            return ResponseEntity.ok(member);
    }

    @PostMapping("/login")
    public ResponseEntity<?> memberLogin(@RequestBody MemberLoginDto memberLoginDto) {
        memberService.login(memberLoginDto);
        return ResponseEntity.ok(memberLoginDto);
    }

    @GetMapping("/check/{nfc}")
    public ResponseEntity<?> getMemberByNfc(@PathVariable String nfc) {
        MemberDto member = memberService.findByNfc(nfc);
        return ResponseEntity.ok(member);
    }

    @GetMapping("/check")
    public ResponseEntity<List<MemberDto>> getMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<MemberDto>> searchMembers(@ModelAttribute RequestMemberDto dto) {
        List<MemberDto> memberDtos = memberService.searchMemberLogs(dto);
        return ResponseEntity.ok(memberDtos);
    }

    @GetMapping("/find")
    public ResponseEntity<?> searchMemberIdAndPw() {
        List<MemberLoginDto> memberLoginDtos = memberService.searchMemberInfo();
        return ResponseEntity.ok(memberLoginDtos);
    }
}
