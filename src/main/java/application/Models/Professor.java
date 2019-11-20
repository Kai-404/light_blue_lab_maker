package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Data
@Getter
@Document
public class Professor {
    //private final String userType = "professor";
    private String userId;
    private ArrayList<String> course_list;
    private ArrayList<String> lab_list;

    public Professor(String userId) {
        this.userId = userId;
        this.course_list = new ArrayList<>();
        this.lab_list = new ArrayList<>();
    }
}
