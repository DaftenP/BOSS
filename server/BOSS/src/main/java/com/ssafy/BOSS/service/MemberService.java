package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.memberDto.MemberLogDto;
import com.ssafy.BOSS.dto.memberDto.MemberResponseDto;
import com.ssafy.BOSS.dto.memberDto.RequestMemberDto;
import com.ssafy.BOSS.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Transactional
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public Member join(Member member) {
        validateDuplicateMember(member); // 중복 검사
        return memberRepository.save(member);
    }

    private void validateDuplicateMember(Member member) {
        Optional<Member> joinMember = memberRepository.findByNfc(member.getNfc());
        if(!joinMember.isEmpty()) {
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        }
    }

    public Optional<Member> findbyNfc(String nfc) {
        return memberRepository.findByNfc(nfc);
    }

    @Transactional(readOnly = true)
    public List<MemberResponseDto> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return members.stream().map(member -> {
            MemberResponseDto dto = new MemberResponseDto();
            dto.setId(member.getMemberId());
            dto.setMemberProfile(member.getProfileImage());
            dto.setMemberName(member.getName());
            if(member.getDepartment() != null) {
                dto.setDepartment(member.getDepartment());
            }
            if(member.getPosition() != null) {
                dto.setPosition(member.getPosition());
            }
            dto.setIssueCount(member.getIssueCount());
            dto.setPhoneNumber(member.getPhoneNumber());
            return dto;
        }).toList();
    }

    public List<MemberLogDto> searchMemberLogs(RequestMemberDto requestMemberDto) {
        return memberRepository.searchMemberLogs(requestMemberDto);
    }
}
