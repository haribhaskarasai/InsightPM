package com.stg.tsm.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stg.tsm.entity.UserstoryMaster;

public interface UserstoryMasterRepository extends JpaRepository<UserstoryMaster, Integer> {
	
	@Query(value = "select * from userstory_master  where SPRINT_ID = ?1 ", nativeQuery = true)
	public abstract List<UserstoryMaster> findAllBySprintId( @Param("sprintId") int sprintId);

	
	@Query(value = "select * from userstory_master  where USERSTORY_ID= ?1 ", nativeQuery = true)
	public abstract Optional<UserstoryMaster> findByUserstoryId(int userstoryId);
	
	@Query(value = "delete from userstory_master  where USERSTORY_ID = ?1 ", nativeQuery = true)
	public abstract void deleteByUserstoryId(int userstoryId);
	
	
}