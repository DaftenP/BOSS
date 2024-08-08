package com.ssafy.BOSS.dto.enteringLog;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.dto.memberDto.MemberDto;
import com.ssafy.BOSS.mapper.MemberMapper;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EnteringLogDto {
    private Long logId;
    private MemberDto member;
    private LocalDateTime time;
    private String deviceFrontImage;
    private String deviceBackImage;
    private int entering;
    private int gateNumber;
    private int stickerCount;
    private int issue;
    private int cameraLens;
}
