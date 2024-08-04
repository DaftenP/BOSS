package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.memberDto.*;
import com.ssafy.BOSS.repository.DepartmentRepository;
import com.ssafy.BOSS.repository.MemberRepository;
import com.ssafy.BOSS.repository.PositionRepository;
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
    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;

    public MemberDto join(MemberRegistDto memberRegistDto) {
        Member member = convertRegistDtoToMember(memberRegistDto);
        validateDuplicateMember(member); // 중복 검사
        return MemberDto.of(memberRepository.save(member));
    }

    private Member convertRegistDtoToMember(MemberRegistDto memberRegistDto) {
        Member member = new Member();
        member.setName(memberRegistDto.getName());
        member.setNfc(memberRegistDto.getNfc());
        member.setProfileImage(memberRegistDto.getProfileImage());
        member.setPhoneNumber(memberRegistDto.getPhoneNumber());
        member.setDepartment(departmentRepository.getReferenceById(memberRegistDto.getDepartmentId()));
        member.setPosition(positionRepository.getReferenceById(memberRegistDto.getPositionId()));
        return member;
    }

    private void validateDuplicateMember(Member member) {
        Optional<Member> joinMember = memberRepository.findByNfc(member.getNfc());
        if(joinMember.isPresent()) {
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
