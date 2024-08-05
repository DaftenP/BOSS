package com.ssafy.BOSS.dto.enteringLog;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Position;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestEnteringLogDto {

    private String name = null;
    private String positionName = null;
    private String departmentName = null;
    private int entering = -1;
    private int issue = -1;
    private LocalDateTime time = null;
}
