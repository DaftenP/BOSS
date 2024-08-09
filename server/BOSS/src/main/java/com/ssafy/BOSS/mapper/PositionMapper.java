package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.dto.position.PositionDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PositionMapper {
    PositionDto positionToPositionDto(Position position);
}
