package application.Controllers;

import application.Models.*;
import application.Services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
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
    @Autowired
    private MailService mailService;

    @PostMapping("/register")
    public int createUser(@RequestBody User user) {
        //System.out.println(user);
        if (userRepository.findByEmail(user.getEmail()) != null) { return 1; }
        if (userRepository.findByUsername(user.getUsername()) != null) { return 2; }
        user.setPassword(encryptPassword(user.getPassword()));
        userRepository.save(user);

        if (user.getUserType().equals("Professor")) {
            Professor professor = new Professor(user.getId());
            professorRepository.save(professor);
        } else {
            Student student = new Student(user.getId());
            studentRepository.save(student);
        }

        mailService.sendVerificationEmail(user.getId(), user.getEmail());
        return 3;
    }

    @GetMapping("/login")
    public User getUser(@RequestParam(name = "email") String email, @RequestParam(name = "password") String password, HttpSession session) {
        String encrypt = encryptPassword(password);
        User user = userRepository.findByEmailAndPassword(email, encrypt);
        if (user != null) {
            session.setAttribute("user", user.getUsername());
            return user;
        }
        user = userRepository.findByUsernameAndPassword(email, encrypt);
        if (user != null)
            session.setAttribute("user", user.getUsername());
        return user;
    }

    @GetMapping("/verify-email")
    public String verifyUserEmail(@RequestParam(name="userId") String id) {
        User user = userRepository.getById(id);
        if (user != null) {
            user.setActive(true);
            userRepository.save(user);
            return "Your email has been verified! Please login.";
        }
        return "Something is wrong.";
    }

    @GetMapping("/reset")
    public boolean sendResetPasswordEmail(@RequestParam(name="email") String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            mailService.sendResetPasswordEmail(email, user.getId());
            return true;
        }
        return false;
    }

    @GetMapping("/reset-password")
    public boolean resetPassword(@RequestParam String id, @RequestParam String password) {
        User user = userRepository.getById(id);
        if (user == null)
            return false;
        else {
            user.setPassword(encryptPassword(password));
            userRepository.save(user);
            return true;
        }
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