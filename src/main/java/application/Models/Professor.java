package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Data
@Getter
@Document
public class Professor {
    private String userid;
    private ArrayList<String> course_list;
    private ArrayList<String> lab_list;

    public Professor(String userid) {
        this.userid = userid;
        this.course_list = new ArrayList<>();
        this.lab_list = new ArrayList<>();
    }
}
