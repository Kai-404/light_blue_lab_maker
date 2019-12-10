package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;

@Data
@Getter
@Document
public class Student {
    @Id
    private String id;
    private String userType = "Student";
    private String userId;
    private ArrayList<String> course_list;
    private HashMap<String,Integer> labProgress;
    private HashMap<String,HashMap<Integer,Integer>> grade;

    public Student(String userId) {
        this.userId = userId;
        this.course_list = new ArrayList<>();
        this.labProgress = new HashMap<>();
        this.grade = new HashMap<>();
    }
}
