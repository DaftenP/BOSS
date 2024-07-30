# 인프라 구성 설명서

```shell
docker compose -f docker-compose.jenkins.yml up -d
```

현재 디렉터리에서, 위 명령어로 젠킨스 서버를 세팅해주세요!

그리고 `<server_url>:22222`으로 접속하셔서 젠킨스 서버 세팅을 끝내주세요.

이후 파이프라인 구성에서 `pipeline from SCM`을 선택하시고,  
개발 서버라면 `develop` 브랜치에서 `boss-dev.jenkinsfile`을,  
릴리즈 서버라면 `master` 브랜치의 `boss-release.jenkinsfile`을 골라서 설정해주시면 됩니다.

## 백엔드

개발 서버를 위한 `application-dev.yml`, 릴리즈 서버를 위한 `application-release.yml` 세팅이 필요합니다.

- `application-dev.yml`에서 mysql 서버 URL을 `boss-dev-db:3306`으로 바꾸어 주세요.
- `application-release.yml`에서 mysql 서버 URL을 `boss-release-db:3306`으로 바꾸어 주세요.

## 프론트엔드

`.env.development`와 `env.production`으로 사용할 백엔드 서버를 분리해주세요.

- `.env.development`에서 localhost로 백엔드 서버 주소를 설정해주세요.
- `.env.production`에서 `boss-dev-backend`로 백엔드 서버 주소를 설정해주세요.