package com.ssafy.BOSS.repository;

import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class EnteringLogRepositoryTest {

//    @Autowired
//    EnteringLogRepository enteringLogRepository;
//
//    @BeforeEach
//    void setup() {
//        enteringLogRepository.deleteAll();
//    }
//
//    @Test
//    public void paginationTest() {
//
//        enteringLogRepository.save(EnteringLog.builder().time("1").build());
//        enteringLogRepository.save(EnteringLog.builder().time("2").build());
//        enteringLogRepository.save(EnteringLog.builder().time("3").build());
//        enteringLogRepository.save(EnteringLog.builder().time("4").build());
//        enteringLogRepository.save(EnteringLog.builder().time("5").build());
//
//        Pageable pageable = PageRequest.of(0, 2);
//
//        Page<EnteringLog> page = enteringLogRepository.getEnteringLogs(new EnteringLogSpecifiedDto("4"), pageable);
//
//        // 4가 1개 검출됨.
////        System.out.println(page.toString());
////        System.out.println(page.getNumberOfElements()); // 현재 슬라이스의 엘리먼트 개수
////        System.out.println(page.getNumber());
////        System.out.println(page.getTotalPages());
////        System.out.println(page.getTotalElements()); // 총 엘리먼트 개수
////        System.out.println(page.getContent());
//
//        assertAll(
//                () -> assertEquals(page.getNumberOfElements(), 1),
//                () -> assertEquals(page.getNumber(), 0),
//                () -> assertEquals(page.getTotalPages(), 1)
//        );
//
//    }

}