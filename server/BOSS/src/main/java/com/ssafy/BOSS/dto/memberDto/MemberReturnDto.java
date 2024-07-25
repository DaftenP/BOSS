package com.ssafy.BOSS.dto.memberDto;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Position;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberReturnDto {
    private String memberProfile;
    private String memberName;
    private Department department;
    private Position position;
    private String nfc;
}