package application.Controllers;

import application.Models.Announcement;
import application.Models.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AnnouncementController {
    @Autowired
    private AnnouncementRepository announcementRepository;

    public boolean createAnnouncement(String title, String content, String author, String courseId) {
        try {
            Announcement announcement = new Announcement(title, content, author, courseId);
            announcementRepository.save(announcement);
        } catch (Error e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public ResponseEntity<List<Announcement>> getAllAnnouncement(String courseId) {
        List<Announcement> announcementList = announcementRepository.findAllByCourseId(courseId);
        if (announcementList.size() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(announcementList, HttpStatus.OK);
        }
    }
}
