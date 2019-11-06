package application.Models;


import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Data
@Getter
@Document(collection="lab")
public class Lab {
    @Id
    private String id;
    private String title;
    private String author;
    private boolean isPublished;
    private List<Stage> stageList;
    private HashMap<String,Integer> labProgress;

    public Lab() {}

    public Lab(String title, String author) {
        this.title = title;
        this.author = author;
        this.isPublished = false;
        this.stageList = new ArrayList<Stage>();
        this.labProgress = new HashMap<String,Integer>();
    }


    public void addStage() {
        this.stageList.add(new Stage(this.stageList.size()));
    }

}
