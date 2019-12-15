package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document
@Getter
@Data
public class Course {
    @Id
    private String id;
    private String title;
    private String professor;
    private String term;
    private String firstName;
    private String lastName;
    private ArrayList<String> student_list;
    private ArrayList<String> lab_list;

    public Course(String title, String term, String professor) {
        this.title = title;
        this.term = term;
        this.professor = professor;
        this.student_list = new ArrayList<>();
        this.lab_list = new ArrayList<>();
    }
}
