package com.ssafy.BOSS.dto.adminDto;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AdminReturnDto {
    private String adminId;
    private String adminPw;
    private String adminName;
}
