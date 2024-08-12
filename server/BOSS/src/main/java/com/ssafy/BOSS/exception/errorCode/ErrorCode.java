package com.ssafy.BOSS.exception.errorCode;

import org.springframework.http.HttpStatus;

public interface ErrorCode {
    String getErrorCode();

    String getMessage();

    HttpStatus getHttpStatus();
}
