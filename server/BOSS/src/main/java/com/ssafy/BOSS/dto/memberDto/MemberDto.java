package com.ssafy.BOSS.dto.memberDto;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.dto.department.DepartmentDto;
import com.ssafy.BOSS.dto.position.PositionDto;
import lombok.*;
import org.hibernate.Hibernate;

@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    private String memberProfile;
    private String memberName;
    private DepartmentDto departmentDto;
    private PositionDto positionDto;
    private String nfc;

    public static MemberDto of(Member member) {
        MemberDto dto = new MemberDto();
        dto.setMemberProfile(member.getProfileImage());
        dto.setMemberName(member.getName());
        dto.setDepartmentDto(DepartmentDto.of(member.getDepartment()));
        dto.setPositionDto(PositionDto.of(member.getPosition()));
        dto.setNfc(member.getNfc());
        return dto;
    }
}
