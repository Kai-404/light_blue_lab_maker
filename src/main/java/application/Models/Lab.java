package application.Models;

import com.mongodb.util.JSON;
import lombok.Data;
import lombok.Getter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.File;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
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

    private ArrayList<Stage> stageList;
    // <tool name, if added to the lab>
    private HashMap<String,Boolean> toolWarehouse;
   // private List<Tool> labTools;
    private HashMap<String,Integer> labProgress;

    public Lab() {}

    public Lab(String title, String author) {
        this.title = title;
        this.author = author;
        this.isPublished = false;
        this.stageList = new ArrayList<Stage>();

        Stage firstStage = new Stage( 0 );
        stageList.add( firstStage );

        this.toolWarehouse = new HashMap<String,Boolean>();
        this.initToolWarehouse();
        //this.labTools = new ArrayList<Tool>();
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

        ClassLoader classLoader = Lab.class.getClassLoader();

        this.toolWarehouse.forEach( (name,display)->{
            JSONObject tool = new JSONObject();
            tool.put("Name", name);
            tool.put("Display", display);
            String className = "application.Tools."+name;
            String imageName = "";
            try {
                Class aClass = classLoader.loadClass( className );
                Constructor constructor = aClass.getConstructor();
                Object object = constructor.newInstance();
                Method method = aClass.getMethod( "getImageName" );
                imageName= (String) method.invoke(object);

            } catch (ClassNotFoundException | NoSuchMethodException | InstantiationException | IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
            }
            tool.put( "Img", imageName);
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

    public JSONObject getStageJSON(int stageNum){
        return stageList.get( stageNum ).getStageAsJSON();
    }

    public Stage getStage(int stageNum){
        return stageList.get( stageNum );
    }


    //add a new stage
    public void addStage(int stageNum) {
        this.stageList.add(stageNum+1, new Stage(stageNum+1));
        this.updateStageList();
    }

    //deletes a stage
    public void deleteStage(int stageNum) {
        this.stageList.remove(stageNum);
        this.updateStageList();
    }


    private void updateStageList() {
        for (int i=0; i<this.stageList.size(); i++) {
            this.stageList.get(i).setStageNum(i);
        }
    }

}