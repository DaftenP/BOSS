package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.dto.department.DepartmentDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    DepartmentDto departmentToDepartmentDto(Department department);
}
