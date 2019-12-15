package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Data
@Getter
@Document(collection="user")
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String userType;
    private String firstName;
    private String lastName;
    private boolean isActive;

    public User() {}

    public  User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.isActive = false;
    }

    public User(String id, String username, String password, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.isActive = false;
    }

    public User(String username, String password, String email, String userType, String firstName, String lastName, boolean isActive) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.userType = userType;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isActive = isActive;
    }

    public User(String id, String username, String password, String email, String userType) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.userType = userType;
        this.isActive = false;
    }
}
