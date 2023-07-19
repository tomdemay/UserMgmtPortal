package com.exostar.usermgmtbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exostar.usermgmtbackend.models.User;

public interface UserRepository extends JpaRepository<User, Long>{
}
