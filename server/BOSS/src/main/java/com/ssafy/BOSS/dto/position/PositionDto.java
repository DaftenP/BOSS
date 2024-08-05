package com.ssafy.BOSS.dto.position;

import com.ssafy.BOSS.domain.Position;
import lombok.Data;

@Data
public class PositionDto {
    private int positionId;
    private String positionName;

    public static PositionDto of(Position position) {
        PositionDto dto = new PositionDto();
        dto.setPositionId(position.getPositionId());
        dto.setPositionName(position.getPositionName());
        return dto;
    }
}
