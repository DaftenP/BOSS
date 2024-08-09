package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnteringLogMapper {
    EnteringLogDto enteringLogToEnteringLogDto(EnteringLog enteringLog);
}
