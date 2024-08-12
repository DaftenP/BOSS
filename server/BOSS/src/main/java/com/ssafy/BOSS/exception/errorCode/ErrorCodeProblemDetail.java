package com.ssafy.BOSS.exception.errorCode;

import lombok.Getter;
import org.springframework.http.ProblemDetail;

@Getter
public class ErrorCodeProblemDetail extends ProblemDetail {
    private final String message;

    public ErrorCodeProblemDetail(ProblemDetail problemDetail, String message) {
        super(problemDetail);
        this.message = message;
    }
}
