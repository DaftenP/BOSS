package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.dto.adminDto.AdminDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    AdminDto adminToAdminDto(Admin admin);
}
