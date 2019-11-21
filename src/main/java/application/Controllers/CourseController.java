package application.Controllers;

import application.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@CrossOrigin
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/addcourse")
    @ResponseBody
    public Course addCourse(@RequestBody Course course, HttpSession session) {
        courseRepository.save(course);
        User user = userRepository.findByUsername((String) session.getAttribute("user"));
        Professor professor = professorRepository.findByUserId(user.getId());
        professor.getCourse_list().add(course.getId());
        professorRepository.save(professor);
        return course;
    }

    @GetMapping("/getcourselist")
    @ResponseBody
    public List<Course> getCourseList(@RequestParam(name="professor") String professor) {
        return courseRepository.findByProfessor(professor);
    }

}
