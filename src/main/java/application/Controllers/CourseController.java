package application.Controllers;

import application.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
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
    @Autowired
    private LabRepository labRepository;

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
    public List<Course> getCourseList(@RequestParam(name = "id") String id,
                                      @RequestParam(name = "username") String username,
                                      @RequestParam(name = "userType") String userType,
                                      @RequestParam(name = "courseName") String courseName,
                                      @RequestParam(name = "term") String term) {
        ArrayList<Course> courseList = new ArrayList<>();
        if (userType.equals("Professor")) {
            List<Course> allCourses = courseRepository.findByProfessor(username);
            for (Course course : allCourses) {
                if (course.getTitle().contains(courseName) && course.getTerm().contains(term)) {
                    courseList.add(course);
                }
            }
        } else {
            Student student = studentRepository.findByUserId(id);
            ArrayList<String> studentCourseList = student.getCourse_list();
            for (String course : studentCourseList) {
                Course newCourse = courseRepository.getById(course);
                if (newCourse.getTitle().contains(courseName) && newCourse.getTerm().contains(term)) {
                    courseList.add(newCourse);
                }
            }
        }
        return courseList;
    }

    @GetMapping("/getcourseselection")
    @ResponseBody
    public List<Course> getCourseSelection(@RequestParam(name = "courseName") String courseName,
                                           @RequestParam(name = "courseTerm") String courseTerm,
                                           @RequestParam(name = "professorName") String professorName) {
        List<Course> allCourses = courseRepository.findAll();
        ArrayList<Course> courseList = new ArrayList<>();
        for (Course course : allCourses) {
            if (course.getTitle().contains(courseName) && course.getTerm().contains(courseTerm) && (course.getFirstName()+" "+course.getLastName()).contains(professorName)) {
                courseList.add(course);
            }
        }
        return courseList;
    }

    @GetMapping("/enrollcourse")
    @ResponseBody
    public void enrollCourse(@RequestParam(name = "userID") String userID, @RequestParam(name = "courseID") String courseID) {
        Student student = studentRepository.findByUserId(userID);
        Course course = courseRepository.getById(courseID);
        student.getCourse_list().add(courseID);
        for (String labID : course.getLab_list()) {
            Lab lab = labRepository.getById(labID);
            if (lab.isPublished()) {
                student.getLabProgress().put(labID, 0);
                HashMap<Integer, Integer> grades = new HashMap<>();
                for (int i = 0; i < lab.getTotalStage(); i++) {
                    grades.put(i, 0);
                }
                student.getGrade().put(labID, grades);
            }
        }
        studentRepository.save(student);
        course.getStudent_list().add(userID);
        courseRepository.save(course);
    }

    @GetMapping("/unenrollcourse")
    @ResponseBody
    public void unenrollCourse(@RequestParam(name = "userID") String userID, @RequestParam(name = "courseID") String courseID) {
        Student student = studentRepository.findByUserId(userID);
        Course course = courseRepository.getById(courseID);
        student.getCourse_list().remove(courseID);
        for (String labID : course.getLab_list()) {
            Lab lab = labRepository.getById(labID);
            if (lab.isPublished()) {
                student.getGrade().remove(labID);
                student.getLabProgress().remove(labID);
            }
        }
        studentRepository.save(student);
        course.getStudent_list().remove(userID);
        courseRepository.save(course);
    }

    @GetMapping("/getlabofcourse")
    @ResponseBody
    public ArrayList<Lab> getLabOfCourse(@RequestParam(name = "id") String courseID, @RequestParam(name = "labName") String labName) {
        Course course = courseRepository.getById(courseID);
        ArrayList<Lab> labList = new ArrayList<>();
        for (String labID : course.getLab_list()) {
            Lab lab = labRepository.getById(labID);
            if (lab.isPublished() && lab.getTitle().contains(labName)) {
                labList.add(lab);
            }
        }
        return labList;
    }

    @GetMapping("/getstudentgrades")
    @ResponseBody
    public ArrayList<ArrayList<String>> getStudentGrades(@RequestParam(name = "courseID") String courseID, @RequestParam(name = "labID") String labID) {
        Course course = courseRepository.getById(courseID);
        ArrayList<ArrayList<String>> grades = new ArrayList<>();
        for (String studentID : course.getStudent_list()) {
            Student student = studentRepository.findByUserId(studentID);
            User user = userRepository.getById(studentID);
            ArrayList<String> studentGrade = new ArrayList<>();
            studentGrade.add(user.getFirstName() + " " + user.getLastName());
            studentGrade.add(Math.round(100 * (student.getLabProgress().get(labID)/(float)labRepository.getById(labID).getTotalStage()))+"%");
            int numTotalStages = labRepository.getById(labID).getTotalStage();
            for (int i = 0; i < numTotalStages; i++) {
                studentGrade.add(student.getGrade().get(labID).get(i).toString());
            }
            grades.add(studentGrade);
        }
        return grades;
    }
}
