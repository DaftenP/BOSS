package com.ssafy.BOSS.exception;

import com.ssafy.BOSS.exception.errorCode.ErrorCode;
import com.ssafy.BOSS.exception.errorCode.ErrorCodeProblemDetail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BossException.class)
    public ProblemDetail handleBossException(BossException e) {
        log.error(e.getMessage());
        ErrorCode errorCode = e.getErrorCode();
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(errorCode.getHttpStatus(), errorCode.getErrorCode());
        return new ErrorCodeProblemDetail(problemDetail, errorCode.getMessage());
    }

    @ExceptionHandler
    public ProblemDetail handleException(Exception e) {
        log.error(e.getMessage());
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

}
