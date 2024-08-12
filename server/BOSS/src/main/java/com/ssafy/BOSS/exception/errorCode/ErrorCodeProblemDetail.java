package com.ssafy.BOSS.exception.errorCode;

import lombok.Getter;
import org.springframework.http.ProblemDetail;

@Getter
public class ErrorCodeProblemDetail extends ProblemDetail {
    private final String errorCode;

    public ErrorCodeProblemDetail(ProblemDetail problemDetail, String errorCode) {
        super(problemDetail);
        this.errorCode = errorCode;
    }
}
