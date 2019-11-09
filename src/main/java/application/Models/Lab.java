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
@Document
public class Lab {
    @Id
    private String id;
    private String title;
    private String author;
    private boolean isPublished;
    private List<Stage> stageList;
    private List<String> toolWarehouse;
    private List<Tool> labTools;
    private HashMap<String,Integer> labProgress;

    public Lab() {}

    public Lab(String title, String author) {
        this.title = title;
        this.author = author;
        this.isPublished = false;
        this.stageList = new ArrayList<Stage>();
        this.toolWarehouse = new ArrayList<String>();
        this.initToolWarehouse();
        this.labTools = new ArrayList<Tool>();
        this.labProgress = new HashMap<String,Integer>();
    }

    //add tool to  warehouse here
    private void initToolWarehouse() {
        this.toolWarehouse.add("tool1");
        this.toolWarehouse.add("tool2");
    }

    //add a new stage
    public void addStage() {
        this.stageList.add(new Stage(this.stageList.size()));
    }

    //deletes a stage
    public void deleteStage(int currentStage) { this.stageList.remove(currentStage); }

    //adds a tool to the whole lab
    public void addLabTool(String tool) {
        this.labTools.add(new Tool(tool));
    }

    //adds a tool to stage currentStage
    public void addStageTool(String tool, int currentStage) {
        this.stageList.get(currentStage).getToolList().add(new Tool(tool));
    }


}
