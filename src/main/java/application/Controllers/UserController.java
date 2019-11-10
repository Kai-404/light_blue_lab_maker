package application.Controllers;

import application.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/register")
    public int createUser(@RequestParam(name = "username") String username, @RequestParam(name = "email") String email,
                          @RequestParam(name = "password") String password, @RequestParam(name = "UserType") String userType) {
        if (userRepository.findByEmail(email) != null) { return 1; }
        if (userRepository.findByUsername(username) != null) { return 2; }
        User newUser = new User(username, email, password);
        userRepository.save(newUser);
        if (userType.equals("Professor")) {
            Professor professor = new Professor(newUser.getId());
            professorRepository.save(professor);
        } else {
            Student student = new Student(newUser.getId());
            studentRepository.save(student);
        }
        return 3;
    }

    @GetMapping("/login")
    public User getUser(@RequestParam(name = "email") String email, @RequestParam(name = "password") String password) {
        User user = userRepository.findByEmailAndPassword(email, password);
        if (user != null) { return user; }
        return userRepository.findByUsernameAndPassword(email, password);
    }

}