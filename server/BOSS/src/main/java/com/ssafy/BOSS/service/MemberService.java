package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.dto.memberDto.MemberDto;
import com.ssafy.BOSS.dto.memberDto.MemberLoginDto;
import com.ssafy.BOSS.dto.memberDto.MemberRegistDto;
import com.ssafy.BOSS.dto.memberDto.RequestMemberDto;
import com.ssafy.BOSS.repository.DepartmentRepository;
import com.ssafy.BOSS.repository.MemberRepository;
import com.ssafy.BOSS.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Transactional
@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;
    private final S3UploadService s3UploadService;

    public MemberDto join(MemberRegistDto memberRegistDto, MultipartFile file) {
        Member member = convertRegistDtoToMember(memberRegistDto);
        validateDuplicateMember(member); // 중복 검사
        String image = s3UploadService.upload(file);
        member.setProfileImage(image);
        return MemberDto.of(memberRepository.save(member));
    }

    private Member convertRegistDtoToMember(MemberRegistDto memberRegistDto) {
        Member member = new Member();
        member.setName(memberRegistDto.getName());
        member.setNfc(memberRegistDto.getNfc());
        member.setProfileImage("");
        member.setPhoneNumber(memberRegistDto.getPhoneNumber());

        if (memberRegistDto.getDepartmentId() == -1) {
            String departmentName = memberRegistDto.getDepartmentName();
            if (departmentRepository.existsByDepartmentName(departmentName)) {
                member.setDepartment(departmentRepository.findByDepartmentName(departmentName));
            } else {
                Department department = Department.builder().departmentName(memberRegistDto.getDepartmentName()).build();
                departmentRepository.save(department);
                member.setDepartment(department);
            }
        } else {
            member.setDepartment(departmentRepository.getReferenceById(memberRegistDto.getDepartmentId()));
        }

        if (memberRegistDto.getPositionId() == -1) {
            String positionName = memberRegistDto.getPositionName();
            if (positionRepository.existsByPositionName(positionName)) {
                member.setPosition(positionRepository.findByPositionName(positionName));
            } else {
                Position position = Position.builder().positionName(memberRegistDto.getPositionName()).build();
                positionRepository.save(position);
                member.setPosition(position);
            }
        } else {
            member.setPosition(positionRepository.getReferenceById(memberRegistDto.getPositionId()));
        }

        member.setMemberLoginPw(memberRegistDto.getMemberLoginPw());
        member.setMemberLoginPw(memberRegistDto.getMemberLoginPw());
        return member;
    }

    public MemberLoginDto login(MemberLoginDto memberLoginDto) {
        Optional<Member> member = memberRepository.findByMemberLoginIdAndMemberLoginPw(memberLoginDto.getMemberLoginId(), memberLoginDto.getMemberLoginPw());
        if (member.isPresent()) {
            return memberLoginDto;
        }
        return null;
    }

    private void validateDuplicateMember(Member member) {
        Optional<Member> joinMember = memberRepository.findByNfc(member.getNfc());
        if (joinMember.isPresent()) {
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        }
    }

    public Optional<Member> findbyNfc(String nfc) {
        return memberRepository.findByNfc(nfc);
    }

    @Transactional(readOnly = true)
    public List<MemberDto> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return members.stream().map(MemberDto::of).toList();
    }

    public List<MemberDto> searchMemberLogs(RequestMemberDto requestMemberDto) {
        List<Member> members = memberRepository.searchMember(requestMemberDto);
        return members.stream().map(MemberDto::of).toList();
    }
}
