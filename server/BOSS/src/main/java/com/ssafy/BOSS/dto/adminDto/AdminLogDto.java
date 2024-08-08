package com.ssafy.BOSS.dto.adminDto;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.domain.LoginLog;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminLogDto {

    private AdminDto admin;
    private LocalDateTime time;

    public static AdminLogDto of(LoginLog log) {
        AdminLogDto adminLogDto = new AdminLogDto();
        adminLogDto.setAdmin(AdminDto.of(log.getAdmin()));
        adminLogDto.setTime(log.getLoginTime());
        return adminLogDto;
    }
}
