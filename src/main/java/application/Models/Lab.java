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
public class Lab {
    @Id
    private String id;
    private String title;
    private String author;
    private boolean is_published;
    private HashMap<String, Integer> lab_progress;
    private ArrayList<Stage> stage_list;

    public Lab(String title, String author) {
        this.title = title;
        this.author = author;
        this.is_published = false;
        this.lab_progress = new HashMap<>();
        this.stage_list = new ArrayList<>();
    }
}
