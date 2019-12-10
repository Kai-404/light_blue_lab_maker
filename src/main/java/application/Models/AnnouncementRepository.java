package application.Models;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    List<Announcement> findAllByCourseIdOrderByDateDesc(String courseId);
}
