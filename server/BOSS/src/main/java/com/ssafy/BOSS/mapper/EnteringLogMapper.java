package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogDto;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogRegistDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnteringLogMapper {
    EnteringLogDto enteringLogToEnteringLogDto(EnteringLog enteringLog);

    EnteringLog enteringLogRegistDtoToEnteringLog(EnteringLogRegistDto dto, Member member, String deviceFrontImage, String deviceBackImage);
}
