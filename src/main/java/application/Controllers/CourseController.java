package application.Controllers;

import application.Models.Course;
import application.Models.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping("/addcourse")
    @ResponseBody
    public Course addCourse(@RequestBody Course course) {
        courseRepository.save(course);
        return course;
    }

    @GetMapping("/getcourselist")
    @ResponseBody
    public List<Course> getCourseList(@RequestParam(name="professor") String professor) {
        return courseRepository.findByProfessor(professor);
    }

}