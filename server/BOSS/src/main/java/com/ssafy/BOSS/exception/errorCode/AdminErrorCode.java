package com.ssafy.BOSS.exception.errorCode;

import org.springframework.http.HttpStatus;

public enum AdminErrorCode implements ErrorCode {
    ADMIN_NOT_FOUND(HttpStatus.NOT_FOUND, "해당하는 어드민이 존재하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    AdminErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    @Override
    public String getErrorCode() {
        return name();
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
