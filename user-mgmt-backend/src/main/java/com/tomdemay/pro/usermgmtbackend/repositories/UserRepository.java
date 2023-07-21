package com.tomdemay.pro.usermgmtbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tomdemay.pro.usermgmtbackend.models.User;

public interface UserRepository extends JpaRepository<User, Long>{
}
