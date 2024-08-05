package com.ssafy.BOSS.dto.enteringLog;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class EnteringLogRegistDto {

    private long memberId;
    private String deviceFrontImage;
    private String deviceBackImage;
    private int entering;
    private int gateNumber;
    private int stickerCount;
    private int issue;
    private int cameraLens;

}
