package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Data
@Getter
@Document
public class Professor {
    private String userType = "Professor";
    @Id
    private String id;
    private String userId;
    private ArrayList<String> course_list;

    public Professor(String userId) {
        this.userId = userId;
        this.course_list = new ArrayList<>();
    }
}
