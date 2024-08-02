package com.ssafy.BOSS.dto.memberDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestMemberDto {

    private String name = null;
    private String positionName = null;
    private String departmentName = null;
    private String nfc = null;
    private int issue = -1;
}
