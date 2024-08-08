package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.dto.department.DepartmentDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    DepartmentDto departmentToDepartmentDto(Department department);
}
