package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @CachePut("departments")
    public void save(Department department) {
        departmentRepository.save(department);
    }

    @Cacheable("departments")
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
}
