package com.heavenhub.repositories;

import com.heavenhub.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) ORDER BY m.sentAt ASC")
    List<Message> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE ((m.sender.id = :user1 AND m.receiver.id = :user2) OR (m.sender.id = :user2 AND m.receiver.id = :user1)) AND m.property.id = :propertyId ORDER BY m.sentAt ASC")
    List<Message> findThread(@Param("user1") Long user1Id, @Param("user2") Long user2Id, @Param("propertyId") Long propertyId);
}
