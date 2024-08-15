package com.ssafy.BOSS.dto.enteringLog;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EnteringLogSpecifiedDto {
    private LocalDateTime CurrentDate;
}
