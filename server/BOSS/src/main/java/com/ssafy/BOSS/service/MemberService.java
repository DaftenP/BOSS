package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.memberDto.MemberDto;
import com.ssafy.BOSS.dto.memberDto.MemberLoginDto;
import com.ssafy.BOSS.dto.memberDto.MemberRegistDto;
import com.ssafy.BOSS.dto.memberDto.RequestMemberDto;
import com.ssafy.BOSS.exception.BossException;
import com.ssafy.BOSS.exception.errorCode.MemberErrorCode;
import com.ssafy.BOSS.mapper.MemberMapper;
import com.ssafy.BOSS.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Transactional
@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final S3UploadService s3UploadService;
    private final MemberMapper memberMapper;

    public MemberDto join(MemberRegistDto memberRegistDto, MultipartFile file) {
        Member member = memberMapper.memberRegistDtoToMember(memberRegistDto);
        validateDuplicateMember(member); // 중복 검사
        String image = s3UploadService.upload(file);
        member.setProfileImage(image);
        return memberMapper.memberToMemberDto(memberRepository.save(member));
    }

    private void validateDuplicateMember(Member member) {
        if (memberRepository.existsByNfc(member.getNfc())) {
            throw new BossException(MemberErrorCode.MEMBER_ALREADY_EXISTS);
        }
    }

    public void login(MemberLoginDto memberLoginDto) {
        if (!memberRepository.existsByMemberLoginIdAndMemberLoginPw(memberLoginDto.getMemberLoginId(), memberLoginDto.getMemberLoginPw())) {
            throw new BossException(MemberErrorCode.MEMBER_NOT_FOUND);
        }
    }

    public MemberDto findByNfc(String nfc) {
        Member member = memberRepository.findByNfc(nfc).orElseThrow(() -> new BossException(MemberErrorCode.MEMBER_NOT_FOUND));
        return memberMapper.memberToMemberDto(member);
    }

    @Transactional(readOnly = true)
    public List<MemberDto> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return members.stream().map(memberMapper::memberToMemberDto).toList();
    }

    public List<MemberDto> searchMemberLogs(RequestMemberDto requestMemberDto) {
        List<Member> members = memberRepository.searchMember(requestMemberDto);
        return members.stream().map(memberMapper::memberToMemberDto).toList();
    }

    public List<MemberLoginDto> searchMemberInfo() {
        List<Member> members = memberRepository.findAll();
        return members.stream().map(memberMapper::memberToMemberLoginDto).toList();
    }

}
