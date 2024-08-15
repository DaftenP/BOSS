package com.ssafy.BOSS.dto.memberDto;

import lombok.Data;

@Data
public class MemberRegistDto {
    private String name;
    private String nfc;
    private String memberLoginId;
    private String memberLoginPw;
    private String phoneNumber;
    private int departmentId = 0;
    private int positionId = 0;

    private String departmentName;
    private String positionName;
}
