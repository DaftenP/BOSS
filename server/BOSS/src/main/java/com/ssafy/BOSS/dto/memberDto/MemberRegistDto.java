package com.ssafy.BOSS.dto.memberDto;

import com.ssafy.BOSS.domain.Member;
import lombok.Data;

@Data
public class MemberRegistDto {
    private String name;
    private String nfc;
    private String profileImage;
    private String phoneNumber;
    private int departmentId;
    private int positionId;
}
