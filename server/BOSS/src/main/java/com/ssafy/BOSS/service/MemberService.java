package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.dto.memberDto.MemberDto;
import com.ssafy.BOSS.dto.memberDto.MemberLoginDto;
import com.ssafy.BOSS.dto.memberDto.MemberRegistDto;
import com.ssafy.BOSS.dto.memberDto.RequestMemberDto;
import com.ssafy.BOSS.exception.BossException;
import com.ssafy.BOSS.exception.errorCode.MemberErrorCode;
import com.ssafy.BOSS.mapper.MemberMapper;
import com.ssafy.BOSS.repository.DepartmentRepository;
import com.ssafy.BOSS.repository.MemberRepository;
import com.ssafy.BOSS.repository.PositionRepository;
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

    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    public MemberDto join(MemberRegistDto memberRegistDto, MultipartFile file) {
        Member member = memberRegistDtoToMember(memberRegistDto);
        validateDuplicateMember(member); // 중복 검사
        String image = s3UploadService.upload(file);
        member.setProfileImage(image);
        return memberMapper.memberToMemberDto(memberRepository.save(member));
    }

    private Member memberRegistDtoToMember(MemberRegistDto memberRegistDto) {
        if (memberRegistDto == null) {
            return null;
        }

        Member member = new Member();

        member.setName(memberRegistDto.getName());
        member.setMemberLoginId(memberRegistDto.getMemberLoginId());
        member.setMemberLoginPw(memberRegistDto.getMemberLoginPw());
        member.setNfc(memberRegistDto.getNfc());
        member.setPhoneNumber(memberRegistDto.getPhoneNumber());

        member.setProfileImage("");

        member.setDepartment(getOrCreateDepartment(memberRegistDto));
        member.setPosition(getOrCreatePosition(memberRegistDto));

        return member;
    }


    private Department getOrCreateDepartment(MemberRegistDto memberRegistDto) {
        if (memberRegistDto.getDepartmentId() != -1) {
            return departmentRepository.getReferenceById(memberRegistDto.getDepartmentId());
        }
        if (departmentRepository.existsByDepartmentName(memberRegistDto.getDepartmentName())) {
            return departmentRepository.findByDepartmentName(memberRegistDto.getDepartmentName());
        }
        Department department = Department.builder().departmentName(memberRegistDto.getDepartmentName()).build();
        departmentRepository.save(department);
        return department;
    }

    private Position getOrCreatePosition(MemberRegistDto memberRegistDto) {
        if (memberRegistDto.getPositionId() != -1) {
            return positionRepository.getReferenceById(memberRegistDto.getPositionId());
        }
        if (positionRepository.existsByPositionName(memberRegistDto.getPositionName())) {
            return positionRepository.findByPositionName(memberRegistDto.getPositionName());
        }
        Position position = Position.builder().positionName(memberRegistDto.getPositionName()).build();
        positionRepository.save(position);
        return position;
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
