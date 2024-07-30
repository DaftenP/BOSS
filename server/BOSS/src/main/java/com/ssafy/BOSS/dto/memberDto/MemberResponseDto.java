package com.ssafy.BOSS.dto.memberDto;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Position;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponseDto {
    private Long id;
    private String memberProfile;
    private String memberName;
    private Department department;
    private Position position;
    private int issueCount;
    private String phoneNumber;
}
