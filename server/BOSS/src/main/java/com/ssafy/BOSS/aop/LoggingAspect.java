package com.ssafy.BOSS.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("execution(* com.ssafy.BOSS..*Controller.*(..))")
    public void controllerPointcut() {}

    @Pointcut("execution(* com.ssafy.BOSS..*Repository.*(..))")
    public void repositoryPointcut() {}

    @Pointcut("execution(* com.ssafy.BOSS..*Service.*(..))")
    public void servicePointcut() {}

    @Pointcut("controllerPointcut() || repositoryPointcut() || servicePointcut()")
    public void mvcPointcut() {}

    @Around("mvcPointcut()")
    public Object logMethodCall(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        StringBuilder params = new StringBuilder();
        for(Object arg : args) {
            if(arg != null) {
                params.append(arg.getClass().getSimpleName() + ": " + arg.toString() + "\n");
            }
        }

        logger.info("ENTER {}::{}", className, methodName);
        logger.info(params.toString());

        Object result = joinPoint.proceed();

        logger.info("EXIT {}::{}", className, methodName);

        return result;
    }

}
