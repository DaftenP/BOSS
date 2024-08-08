package com.ssafy.BOSS.dto.adminDto;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.domain.LoginLog;
import lombok.Data;

import java.util.List;

@Data
public class AdminDto {

    private long id;
    private String adminLoginId;
    private String adminLoginPw;
    private String adminName;
}
