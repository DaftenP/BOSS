package com.ssafy.BOSS.dto.enteringLog;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Position;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EnteringLogDto {

    private String name;
    private String positionName;
    private String departmentName;
    private Long id;
    private int entering;
    private int issue;
    private LocalDateTime time;
}
