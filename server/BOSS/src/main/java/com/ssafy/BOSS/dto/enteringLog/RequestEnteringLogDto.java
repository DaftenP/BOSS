package com.ssafy.BOSS.dto.enteringLog;

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
    private long memberId = -1;
    private String positionName = null;
    private int positionId = -1;
    private String departmentName = null;
    private int departmentId = -1;
    private int entering = -1;
    private int issue = -1;
    private LocalDateTime startTime = LocalDateTime.of(1970,1,1,1,0);
    private LocalDateTime endTime = LocalDateTime.of(2038,1,1,0,0);
}
