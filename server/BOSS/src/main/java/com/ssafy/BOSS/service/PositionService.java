package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PositionService {

    private final PositionRepository positionRepository;

    public void save(Position position) {
        positionRepository.save(position);
    }

    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }
}
