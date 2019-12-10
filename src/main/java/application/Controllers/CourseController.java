package application.Controllers;

import application.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/addcourse")
    @ResponseBody
    public Course addCourse(@RequestBody Course course) {
        courseRepository.save(course);
        User user = userRepository.findByUsername(course.getProfessor());
        Professor professor = professorRepository.findByUserId(user.getId());
        professor.getCourse_list().add(course.getId());
        professorRepository.save(professor);
        return course;
    }

    @GetMapping("/getcourselist")
    @ResponseBody
    public List<Course> getCourseList(@RequestParam(name="id") String id,
                                      @RequestParam(name="username") String username,
                                      @RequestParam(name="userType") String userType) {
        if (userType.equals("Professor")) {
            return courseRepository.findByProfessor(username);
        }
        else {
            ArrayList<Course> courseList = new ArrayList<Course>();
            Student student = studentRepository.findByUserId(id);
            ArrayList<String> studentCourseList = student.getCourse_list();
            for (String course : studentCourseList) {
                if (courseRepository.findById(course).isPresent()) {
                    courseList.add(courseRepository.findById(course).get());
                }
            }
            return courseList;
        }
    }

    @GetMapping("/getcourseselection")
    @ResponseBody
    public List<Course> getCourseSelection(@RequestParam(name="courseName") String courseName,
                                           @RequestParam(name="courseTerm") String courseTerm) {
        if (courseName.isEmpty() & courseTerm.isEmpty())
            return courseRepository.findAll();
        else if (courseName.isEmpty() & !courseTerm.isEmpty())
            return courseRepository.findByTerm(courseTerm);
        else if (courseTerm.isEmpty())
            return courseRepository.findByTitle(courseName);
        else
            return courseRepository.findByTitleAndTerm(courseName, courseTerm);
    }

    @GetMapping("/enrollcourse")
    @ResponseBody
    public void enrollCourse(@RequestParam(name="userID") String userID, @RequestParam(name="courseID") String courseID) {
        Student student = studentRepository.findByUserId(userID);
        student.getCourse_list().add(courseID);
        studentRepository.save(student);
        Course course = courseRepository.getById(courseID);
        course.getStudent_list().add(userID);
        courseRepository.save(course);
    }

    @GetMapping("/unenrollcourse")
    @ResponseBody
    public void unenrollCourse(@RequestParam(name="userID") String userID, @RequestParam(name="courseID") String courseID) {
        Student student = studentRepository.findByUserId(userID);
        student.getCourse_list().remove(courseID);
        studentRepository.save(student);
        Course course = courseRepository.getById(courseID);
        course.getStudent_list().remove(userID);
        courseRepository.save(course);
    }
}
