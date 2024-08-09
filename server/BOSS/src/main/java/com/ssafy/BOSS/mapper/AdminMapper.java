package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.dto.adminDto.AdminDto;
import com.ssafy.BOSS.dto.adminDto.SignInDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    AdminDto adminToAdminDto(Admin admin);
    SignInDto adminToSigninDto(Admin admin);
}
