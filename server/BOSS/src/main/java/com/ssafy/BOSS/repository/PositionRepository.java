package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Position;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Integer> {
}
