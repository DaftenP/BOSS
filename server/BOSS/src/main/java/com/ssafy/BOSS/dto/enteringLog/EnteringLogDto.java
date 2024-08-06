package com.ssafy.BOSS.dto.enteringLog;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.dto.memberDto.MemberDto;
import lombok.*;

import java.time.Instant;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EnteringLogDto {

    private Long logId;
    private MemberDto member;
    private Instant time;
    private String deviceFrontImage;
    private String deviceBackImage;
    private int entering;
    private int gateNumber;
    private int stickerCount;
    private int issue;
    private int cameraLens;

    public static EnteringLogDto of(EnteringLog enteringLog) {
        EnteringLogDto enteringLogDto = new EnteringLogDto();
        enteringLogDto.setLogId(enteringLog.getLogId());
        enteringLogDto.setMember(MemberDto.of(enteringLog.getMember()));
        enteringLogDto.setTime(enteringLog.getTime());
        enteringLogDto.setDeviceFrontImage(enteringLog.getDeviceFrontImage());
        enteringLogDto.setDeviceBackImage(enteringLog.getDeviceBackImage());
        enteringLogDto.setEntering(enteringLog.getEntering());
        enteringLogDto.setGateNumber(enteringLog.getGateNumber());
        enteringLogDto.setStickerCount(enteringLog.getStickerCount());
        enteringLogDto.setIssue(enteringLog.getIssue());
        enteringLogDto.setCameraLens(enteringLog.getCameraLens());
        return enteringLogDto;
    }
}
