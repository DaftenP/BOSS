package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.LoginLog;
import com.ssafy.BOSS.dto.adminDto.AdminLogDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminLogMapper {
    @Mapping(target = "time", source = "loginTime")
    AdminLogDto loginLogToAdminLogDto(LoginLog loginLog);
}
