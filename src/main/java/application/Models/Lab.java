package application.Models;

import com.mongodb.util.JSON;
import lombok.Data;
import lombok.Getter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.File;
import java.io.PrintStream;
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

    // <tool name, if added to the lab>
    private HashMap<String,Boolean> toolWarehouse;

    private List<Tool> labTools;
    private HashMap<String,Integer> labProgress;

    public Lab() {}

    public Lab(String title, String author) {
        this.title = title;
        this.author = author;
        this.isPublished = false;
        this.stageList = new ArrayList<Stage>();
        this.toolWarehouse = new HashMap<String,Boolean>();
        this.initToolWarehouse();
        this.labTools = new ArrayList<Tool>();
        this.labProgress = new HashMap<String,Integer>();
    }

    //add tool to warehouse here
    private void initToolWarehouse() {
        File[] files = new File("./src/main/java/application/Tools").listFiles();

        for (File file : files) {
            if (file.isFile()) {
                //System.out.println( file.getName() );

                this.toolWarehouse.put(file.getName().replace( ".java",""), false);
            }

        }
    }

//    public HashMap<String,Boolean> getToolWarehouse(){
//        return toolWarehouse;
//    }

    public JSONArray getToolWarehouse(){

        JSONArray toolWarehouseList = new JSONArray();

        this.toolWarehouse.forEach( (name,display)->{
            JSONObject tool = new JSONObject();
            tool.put("Name", name);
            tool.put("Display", display);
            toolWarehouseList.put(tool);

        } );

        System.out.println( toolWarehouseList);
        return toolWarehouseList;
    }

    public void updateToolWareHouse(String toolWarehouseList){

        JSONObject jsonObject = new JSONObject(toolWarehouseList);

        JSONArray jsonArray = jsonObject.getJSONArray("tool");

        HashMap<String,Boolean> newWareHouse = new HashMap<>();

        jsonArray.forEach( e->{
            JSONObject tool = (JSONObject) e;
            newWareHouse.put( (String)tool.get( "Name" ), (Boolean) tool.get( "Display" ) );

        } );
        this.toolWarehouse = newWareHouse;


    }



    //add a new stage
    public void addStage() {
        this.stageList.add(new Stage(this.stageList.size()));
    }

    //deletes a stage
    public void deleteStage(int currentStage) { this.stageList.remove(currentStage); }

//    //adds a tool to the whole lab
//    public void addLabTool(String tool) {
//        this.labTools.add(new Tool(tool));
//    }
//
//    //adds a tool to stage currentStage
//    public void addStageTool(String tool, int currentStage) {
//        this.stageList.get(currentStage).getToolList().add(new Tool(tool));
//    }


}