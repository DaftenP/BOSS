package com.ssafy.BOSS.dto.adminDto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminLogDto {
    private AdminDto admin;
    private LocalDateTime time;
}
