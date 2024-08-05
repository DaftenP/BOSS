package com.ssafy.BOSS.dto.memberDto;

import lombok.Data;

@Data
public class MemberRegistDto {
    private String name;
    private String nfc;
    private String memberLoginId;
    private String memberLoginPw;
    //private String profileImage;
    private String phoneNumber;
    private int departmentId;
    private int positionId;
}
