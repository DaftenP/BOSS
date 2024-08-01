package com.ssafy.BOSS.dto.enteringLog;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Position;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class RequestEnteringLogDto {

    private String name;
    private Position positionName;
    private Department departmentName;
    private int entering;
    private int issue;
    private LocalDateTime time;
}
