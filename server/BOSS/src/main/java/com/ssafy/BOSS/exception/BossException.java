package com.ssafy.BOSS.exception;

import com.ssafy.BOSS.exception.errorCode.ErrorCode;
import lombok.Getter;

@Getter
public class BossException extends RuntimeException {

    private final ErrorCode errorCode;

    public BossException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

}
