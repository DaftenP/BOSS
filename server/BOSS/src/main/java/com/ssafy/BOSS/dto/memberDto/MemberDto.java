package com.ssafy.BOSS.dto.memberDto;

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
}