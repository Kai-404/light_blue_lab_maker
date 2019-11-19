package application.Controllers;

import application.Models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

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
        user.setPassword(encryptPassword(user.getPassword()));
       
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
        String encrypt = encryptPassword(password);
        User user = userRepository.findByEmailAndPassword(email, encrypt);
        if (user != null) { return user; }
        return userRepository.findByUsernameAndPassword(email, encrypt);
    }

    private String encryptPassword(String password) {
        try {
            MessageDigest sh = MessageDigest.getInstance("SHA-256");
            sh.update(password.getBytes());
            byte[] bytes = sh.digest();
            StringBuilder sb = new StringBuilder();
            for (byte aByte : bytes) {
                sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

}