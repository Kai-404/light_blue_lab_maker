package application.Models;

import application.Tools.*;
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
import java.util.UUID;

@Getter
@Setter
@Document
public class Stage {

    private String instructions="";
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

    public boolean addTool(String toolName){
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
        UUID uuid = UUID.randomUUID();
        String toolID = uuid.toString();

        //System.out.println( toolID );

        tool.setId( toolID );

        stageToolList.add( tool );
//        System.out.println( tool.getName() );
//        System.out.println( stageToolList.toString() );
        return true;
    }

    public boolean deleteTool(String ID){
        for (Tool tool : stageToolList) {
            if (tool.getId().equals( ID )) {
                stageToolList.remove( tool );
                return true;
            }
        }

        return false;
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

    public Tool getToolByID(String ID){
        Tool toReturn = null;
        for (Tool tool : stageToolList) {
            if (tool.getId().equals( ID )) {
                toReturn= tool;
            }
        }
        return toReturn;
    }

    public JSONObject getStageAsJSON(){

        JSONObject stageJSONObject = new JSONObject();
        stageJSONObject.put( "stageNum",this.stageNum );
        stageJSONObject.put( "instructions",this.instructions );


        JSONArray toolList = new JSONArray();

        stageToolList.forEach( tool->{
            toolList.put( tool.getToolAsJSON() );
        } );

        stageJSONObject.put( "stageTool",toolList );


        return  stageJSONObject;
    }

        public boolean updateToolProp(String toolID, String toolProps){

        boolean updateSuccess = true;
        for (Tool tool : stageToolList) {
            if (tool.getId().equals( toolID )) {
                int index = stageToolList.indexOf( tool );
                if (tool.getName().equals( "Beaker" )){
                    Beaker beaker = (Beaker) tool;
                    updateSuccess = beaker.updateProp( toolProps );
                    //toReturn = beaker.getToolAsJSON();
                    stageToolList.set( index,beaker );
                }else if (tool.getName().equals( "PHPaper" )){
                    PHPaper phpaper = (PHPaper) tool;
                    updateSuccess = phpaper.updateProp( toolProps );
                    //toReturn = phpaper.getToolAsJSON();
                    stageToolList.set( index,phpaper );
                }else if (tool.getName().equals( "Flask" )){
                    Flask flask = (Flask) tool;
                    updateSuccess = flask.updateProp( toolProps );
                    stageToolList.set( index,flask );

                }else if (tool.getName().equals( "Pipette" )){
                    Pipette pipette = (Pipette) tool;
                    updateSuccess = pipette.updateProp( toolProps );
                    stageToolList.set( index,pipette );

                }
//                else if (tool.getName().equals( "AlcoholBurner" )){
//                    AlcoholBurner alcoholBurner = (AlcoholBurner) tool;
//                    alcoholBurner.updateProp( toolProps );
//                    toReturn = alcoholBurner.getToolAsJSON();
//                    stageToolList.set( index,alcoholBurner );
// Removed Tool
//                }
            }
        }
        return updateSuccess;

    }

    public void doInteraction(String id, String id2, String prams){

        Tool tool1 = this.getToolByID( id );
        Tool tool2 = this.getToolByID( id2 );

        JSONObject interactionPrams = new JSONObject(prams);

        if (interactionPrams.get( "Name" ).equals( "Pour" )){

            if (tool1.getName().equals( "Beaker" )){

                Beaker beaker = (Beaker) tool1;
                JSONObject amount = (JSONObject) interactionPrams.get( "Prams" );
                beaker.pour( tool2, Double.parseDouble( String.valueOf( amount.get( "Value" ) ) ));
            }else if (tool1.getName().equals( "Flask" )){

                Flask flask = (Flask) tool1;
                JSONObject amount = (JSONObject) interactionPrams.get( "Prams" );
                flask.pour( tool2, Double.parseDouble( String.valueOf( amount.get( "Value" ) ) ));

            }

        }





    }


}
