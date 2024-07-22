package com.ssafy.BOSS.exception;

import lombok.Getter;

@Getter
public class BussinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BussinessException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
