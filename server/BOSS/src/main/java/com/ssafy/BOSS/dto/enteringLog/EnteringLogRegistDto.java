package com.ssafy.BOSS.dto.enteringLog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EnteringLogRegistDto {

    private long memberId;
    private int entering;
    private int gateNumber;
    private int stickerCount;
    private int issue;
    private int cameraLens;

}
