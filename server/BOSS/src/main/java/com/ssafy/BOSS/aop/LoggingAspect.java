package com.ssafy.BOSS.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.ssafy.BOSS..*Controller.*(..))")
    public void logMethodCall(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        StringBuilder params = new StringBuilder();
        for(Object arg : args) {
            if(arg != null) {
                params.append(arg.getClass().getSimpleName() + ": " + arg.toString() + "\n");
            }
        }

        logger.info("{}::{}", className, methodName);
        logger.info(params.toString());
    }

}
