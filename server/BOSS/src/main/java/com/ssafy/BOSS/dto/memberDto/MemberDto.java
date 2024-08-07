package com.ssafy.BOSS.dto.memberDto;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.department.DepartmentDto;
import com.ssafy.BOSS.dto.position.PositionDto;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    private Long memberId;
    private DepartmentDto department;
    private PositionDto position;
    private String name;
    private String nfc;
    private String profileImage;
    private int issueCount;
    private String phoneNumber;

    public static MemberDto of(Member member) {
        MemberDto dto = new MemberDto();
        dto.setMemberId(member.getMemberId());
        dto.setDepartment(DepartmentDto.of(member.getDepartment()));
        dto.setPosition(PositionDto.of(member.getPosition()));
        dto.setName(member.getName());
        dto.setNfc(member.getNfc());
        dto.setProfileImage(member.getProfileImage());
        dto.setIssueCount(member.getIssueCount());
        dto.setPhoneNumber(member.getPhoneNumber());
        return dto;
    }
}
