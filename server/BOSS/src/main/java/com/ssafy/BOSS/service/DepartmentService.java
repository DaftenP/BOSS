package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public void save(Department department) {
        departmentRepository.save(department);
    }
}
