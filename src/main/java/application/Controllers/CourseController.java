package application.Controllers;

import application.Models.Course;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CourseController {
    @ResponseBody
    public void createCourse(@RequestParam(name = "courseName") String courseName, @RequestParam(name = "term") String term) {
        Course course = new Course(courseName, term);
    }
}
