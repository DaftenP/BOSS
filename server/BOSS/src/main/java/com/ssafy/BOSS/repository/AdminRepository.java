package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Admin;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AdminRepository {

    public final EntityManager em;

    public void save(Admin admin) {
        em.persist(admin);
    }

    public Admin findId(String id) {
        return em.find(Admin.class, id);
    }
}
