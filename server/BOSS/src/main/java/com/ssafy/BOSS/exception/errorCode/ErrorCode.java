package com.ssafy.BOSS.exception.errorCode;

import org.springframework.http.HttpStatus;

public interface ErrorCode {
    public String getErrorCode();
    public String getMessage();
    public HttpStatus getHttpStatus();
}
