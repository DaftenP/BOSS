package com.ssafy.BOSS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class) // 스프링 시큐리티 기본 로그인 페이지 제거
public class BossApplication {

	public static void main(String[] args) {

        SpringApplication.run(BossApplication.class, args);
	}

}
