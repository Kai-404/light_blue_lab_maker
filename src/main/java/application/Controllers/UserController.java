package application.Controllers;

import application.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/register")
    public int createUser(@RequestBody User user) {
        System.out.println(user);
        if (userRepository.findByEmail(user.getEmail()) != null) { return 1; }
        if (userRepository.findByUsername(user.getUsername()) != null) { return 2; }
        if (user.getUserType().equals("Professor")) {
            Professor professor = new Professor(user.getId());
            professorRepository.save(professor);
            userRepository.save(user);
        } else {
            Student student = new Student(user.getId());
            studentRepository.save(student);
            userRepository.save(user);
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