package com.ssafy.BOSS.dto.department;

import com.ssafy.BOSS.domain.Department;
import lombok.Data;

@Data
public class DepartmentDto {
    private int departmentId;
    private String departmentName;

    public static DepartmentDto of(Department department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setDepartmentId(department.getDepartmentId());
        dto.setDepartmentName(department.getDepartmentName());
        return dto;
    }
}
