package com.ssafy.BOSS.dto.memberDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class MemberLogDto {

    private String name;
    private String positionName;
    private String departmentName;
    private String nfc;
    private int issue;
}
