## 2024-07-22
백엔드 작업에 필요한 엔티티를 작성했다.
아래는 엔티티중 EnteringLog 엔티티이다
```java
package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class EnteringLog {

    @Id @GeneratedValue
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mameber_id")
    private Member member;

    private String time;

    private String deviceFrontImage;

    private String deviceBackImage;

    private int entering;

    private int gateNumber;

    private int stickerCount;

    private int issue;

    private int cameraLens;

}
```

엔티티를 작성하고 로그인 구현을 하고 있었다.
하지만 로그인 구현을 JWT로 할지 일반 아이디 패스워드 체킹으로 할지 정확히 안정해 져서 일단 JWT로 해보자! 라고 정하고 공부했다.

<strong>JWT(Json Web Token) 이란</strong>

- JWT는 유저를 인증하고 식별하기 위한 토큰(Token) 기반 인증입니다.
- 토큰 자체에 사용자의 권한 정보나 서비스를 사용하기 위한 정보가 포함됩니다.
- RESTful과 같은 무상태(Stateless)인 환경에서 사용자 데이터를 주고받을 수 있게 됩니다.
- 세션(Session)을 사용하게 될 경우 쿠키 등을 통해 사용자를 식별하고 서버에 세션을 저장했지만, 토큰을 클라이언트에 저장하고 요청시 HTTP 헤더에 토큰을 첨부하는 것만으로도 단순하게 데이터를 요청하고 응답받을 수 있습니다.

<strong>내일 해볼것</strong>
- 로그인 기능 구현하기
- 가능하면 JWT 적용하기


# 2024-07-23

로그인 기능을 구현하였다. JWT를 구현하다가 잘 안되어서 일단 아이디 패스워드 체킹만 하였다.

<strong>로그인 서비스</strong>

```java
package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.exception.BussinessException;
import com.ssafy.BOSS.exception.ErrorCode;
import com.ssafy.BOSS.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin login(String adminId, String adminPw) {
        Optional<Admin> admin = adminRepository.findByAdminIdAndAdminPw(adminId, adminPw);
        if(admin.isPresent()) {
            return admin.get();
        }
        else {
            return null;
        }
    }
}
```

<strong>로그인 컨트롤러</strong>

```java
package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.service.AdminService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("api/admin/login")
    public ResponseEntity<?> login(@RequestParam String adminId, @RequestParam String adminPw) {
        try {
            Admin admin = adminService.login(adminId, adminPw);
            if(admin != null) {
                AdminReturnDto adminReturnDto = new AdminReturnDto();
                adminReturnDto.setAdminId(adminId);
                adminReturnDto.setAdminPw(adminPw);
                return ResponseEntity.ok(adminReturnDto);
            } else {
                return ResponseEntity.noContent().build();
            }
        }
        catch(Exception e) {
            return exceptionHandling(e);
        }
    }

    @Data
    static class AdminReturnDto {
        private String adminId;
        private String adminPw;
    }

    private ResponseEntity<String> exceptionHandling(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body("Sorry: " + e.getMessage());
    }
}
```

그리고 iot와 통신을 어떻게 할까 고민을 하다가 SSE 통신을 알게되어 찾아보았다.

<strong>배경</strong>

HTTP 특징인 비연결성은 연결한 적이 있어도 연결을 끊어버린다는 것이다.
이를 해결하기 위한 웹 기술은 Polling, Long Polling, WebSocket 그리고 SSE가 있다.

여기서 SSE는 단방향 통신이며 클라이언트의 별도 추가요청 없이 서버에서 업데이트를 스트리밍할 수 있다는 특징을 가진다.

<strong>장점과 단점</strong>

장점
1. HTTP를 통해 통신하므로 다른 프로토콜은 필요가 없고, 구현이 굉장히 쉽다는 것이다.
2. 네트워크 연결이 끊겼을 때 자동으로 재연결을 시도한다.
3. 실시간으로 서버에서 클라이언트로 데이터를 전송할 수 있다. 폴링 같은 경우는 실시간이라고 보기 어려운 점이 있는데, 이러한 한계를 극복한다.

단점
1. GET 메소드만 지원하고, 파라미터를 보내는데 한계가 있다.
2. 단방향 통신이며, 한 번 보내면 취소가 불가능하다는 단점이 있다.
3. 클라이언트가 페이지를 닫아도 서버에서 감지하기가 어렵다는것도 단점이다.
4. SSE는 지속적인 연결을 유지해야 하므로, 많은 클라이언트가 동시에 연결을 유지할 경우 서버 부담이 커질 수 있다.

<strong>내일 해볼것</strong>

- 멤버 저장 및 멤버 조회기능 구현해보기
- 기능 구현 속도 올려보기