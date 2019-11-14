package application.Models;

import com.mongodb.util.JSON;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.data.mongodb.core.mapping.Document;


import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document
public class Stage {

    private String instructions;
    private ArrayList<Tool> stageToolList;
    private int stageNum;

    public Stage(int stageNum) {
        this.stageNum = stageNum;
        this.stageToolList =  new ArrayList<>( );
    }

    public void setStageNum(int stageNum){
        this.stageNum = stageNum;
    }

    public ArrayList<Tool> getStageToolList(){
        return stageToolList;
    }

    public void setInstruction(String instruction){
        this.instructions = instruction;
    }

    public boolean addTool(String toolName, String ID){
        Tool tool = null;

        ClassLoader classLoader = Stage.class.getClassLoader();
        try {
            Class aClass = aClass = classLoader.loadClass(  "application.Tools."+toolName);
            Constructor constructor = aClass.getConstructor();
            Object object = constructor.newInstance();

            tool = (Tool) object;
        }catch (ClassNotFoundException | NoSuchMethodException | InstantiationException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

        tool.setId( ID );

        stageToolList.add( tool );
        return true;
    }

    public JSONObject getTool(String ID){
        JSONObject toReturn = null;
        for (Tool tool : stageToolList) {
            if (tool.getId().equals( ID )) {
                toReturn= tool.getToolAsJSON();
            }
        }
        return toReturn;
    }

    public JSONObject getStageAsJSON(){

        JSONObject stageJSONObject = new JSONObject();
        stageJSONObject.put( "stageNum",this.stageNum );
        stageJSONObject.put( "instruct",this.instructions );


        JSONArray toolList = new JSONArray();

        stageToolList.forEach( tool->{
            toolList.put( tool.getToolAsJSON() );
        } );

        stageJSONObject.put( "stageTool",toolList );


        return  stageJSONObject;
    }
}
