package com.ssafy.BOSS.dto.enteringLog;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EnteringLogDto {

    private String name;
    private String position;
    private String department;
    private Long id;
    private int entering;
    private int issue;
    private LocalDateTime time;
}