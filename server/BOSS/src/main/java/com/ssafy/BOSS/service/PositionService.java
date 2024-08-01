package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PositionService {

    private final PositionRepository positionRepository;

    public void save(Position position) {
        positionRepository.save(position);
    }
}
