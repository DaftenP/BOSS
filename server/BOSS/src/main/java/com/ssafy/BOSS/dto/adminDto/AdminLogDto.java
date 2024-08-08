package com.ssafy.BOSS.dto.adminDto;

import com.ssafy.BOSS.domain.Admin;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminLogDto {

    private Admin admin;
    private LocalDateTime time;
}
