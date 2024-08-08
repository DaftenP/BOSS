package com.ssafy.BOSS.dto.adminDto;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.domain.LoginLog;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminLogDto {
    private AdminDto admin;
    private LocalDateTime time;
}
