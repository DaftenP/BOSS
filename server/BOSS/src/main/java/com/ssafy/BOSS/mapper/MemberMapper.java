package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.dto.memberDto.MemberDto;
import com.ssafy.BOSS.dto.memberDto.MemberLoginDto;
import com.ssafy.BOSS.dto.memberDto.MemberRegistDto;
import com.ssafy.BOSS.repository.DepartmentRepository;
import com.ssafy.BOSS.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public abstract class MemberMapper {

    private DepartmentRepository departmentRepository;
    private PositionRepository positionRepository;

    @BeforeMapping
    public void injectRepository(DepartmentRepository departmentRepository, PositionRepository positionRepository) {
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
    }

    abstract public MemberDto memberToMemberDto(Member member);

    abstract public MemberLoginDto memberToMemberLoginDto(Member member);

    @Mapping(target = "profileImage", constant = "")
    public Member memberRegistDtoToMember(MemberRegistDto memberRegistDto) {
        if(memberRegistDto == null) {
            return null;
        }

        Member member = new Member();

        member.setName( memberRegistDto.getName() );
        member.setMemberLoginId( memberRegistDto.getMemberLoginId() );
        member.setMemberLoginPw( memberRegistDto.getMemberLoginPw() );
        member.setNfc( memberRegistDto.getNfc() );
        member.setPhoneNumber( memberRegistDto.getPhoneNumber() );

        member.setProfileImage( "" );

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
}
