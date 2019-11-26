package application.Controllers;

import application.Models.*;
import application.Services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AnnouncementController {
    @Autowired
    private AnnouncementRepository announcementRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MailService mailService;

    @ResponseBody
    public boolean createAnnouncement(String title, String content, String author, String courseId) {
        try {
            Announcement announcement = new Announcement(title, content, author, courseId);
            announcementRepository.save(announcement);
            Course course = courseRepository.getById(courseId);
            StringBuilder stringBuilder = new StringBuilder();
            for (String id : course.getStudent_list()) {
                User user = userRepository.getById(id);
                if (user != null) {
                    stringBuilder.append(user.getEmail()).append(", ");
                }
            }
            String emails = stringBuilder.toString();
            System.out.println(emails);
            if (!emails.equals("")) {
                // send notification email
                mailService.sendNotificationEmail(title, emails);
            }
        } catch (Error e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @ResponseBody
    public ResponseEntity<List<Announcement>> getAllAnnouncement(String courseId) {
        List<Announcement> announcementList = announcementRepository.findAllByCourseId(courseId);
        if (announcementList.size() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(announcementList, HttpStatus.OK);
        }
    }
}
