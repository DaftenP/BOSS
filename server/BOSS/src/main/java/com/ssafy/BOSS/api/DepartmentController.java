package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/department")
public class DepartmentController {

    private final DepartmentService departmentService;

    public ResponseEntity<?> registDepartment(@RequestBody Department department) {
        departmentService.save(department);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

}
