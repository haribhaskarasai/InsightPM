package com.stg.tsm.repos;


import org.springframework.data.jpa.repository.JpaRepository;

import com.stg.tsm.entity.UserRole;
import com.stg.tsm.entity.UserRolePK;

public interface UserRoleRepository extends JpaRepository<UserRole, UserRolePK> {
}