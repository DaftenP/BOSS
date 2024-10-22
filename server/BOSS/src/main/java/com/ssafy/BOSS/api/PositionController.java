package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/position")
public class PositionController {

    private final PositionService positionService;

    @PostMapping("/regist")
    public ResponseEntity<?> registPosition(@RequestBody Position position) {
        positionService.save(position);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/view")
    public ResponseEntity<List<Position>> getAllDepartments() {
        return ResponseEntity.ok(positionService.getAllPositions());
    }

}
