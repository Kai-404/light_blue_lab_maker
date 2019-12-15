package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class PHPaper extends Tool {
    @Field("PHName")
    String name = "PHPaper";
    @Field("PHImageName")
    final String imageName = "ph.png";
    @Field("PHx")
    int x = 0;
    @Field("PHy")
    int y = 0;
    @Field("PHPaperNickName")
    String nickName = "PH Paper";

    //initial property
    String color = "#ffffff";
    String phStatus = "NONE";
    //final property
    String finalColor = "#005E57";
    String finalPhStatus = "NEUTRAL";

    @Field("PHInteractWith")
    Map<String,String> canInteractWith = Map.of(
            "Beaker","Measure",
            "Flask","Measure"
    );

//    HashMap<String,Boolean> propertyEditableList = new HashMap<String, Boolean>( ){{
//        put( "color", false );
//        put( "phStatus", false );
//
//        put( "finalColor", true );
//        put( "finalPhStatus", true );
//    }};
//
//    HashMap<String,String> propertyNameList = new HashMap<String, String>( ){{
//        put( "color", "Color" );
//        put( "phStatus", "PH Status" );
//
//        put( "finalColor", "Final Color" );
//        put( "finalPhStatus", "Final PH Status"  );
//    }};


    public PHPaper(){

    }

    public String getName(){
        return this.name;
    }


    @Override
    public String getImageName() {
        return imageName;
    }


    public JSONObject getToolAsJSON(){

        JSONObject toolJSONObject = new JSONObject();
        toolJSONObject.put( "id",this.id );
        toolJSONObject.put( "Name",this.name );
        toolJSONObject.put( "Img",this.imageName );
        toolJSONObject.put( "x",this.x );
        toolJSONObject.put( "y",this.y );
        toolJSONObject.put( "nickname",this.nickName );

        JSONArray properties = new JSONArray();

        JSONObject colorProp = new JSONObject();
        colorProp.put( "Name","Color" );
        colorProp.put( "Value",this.color );
        colorProp.put( "Editable", false );
        colorProp.put( "ValidColor",
                new ArrayList<String>(
                        Arrays.asList( "#6a0dad", "#ff0000","#005E57","#ffffff" )
                )
        );

        JSONObject phStatusProp = new JSONObject();
        phStatusProp.put( "Name","PH Status" );
        phStatusProp.put( "Value",this.phStatus );
        phStatusProp.put( "Editable", false );
        phStatusProp.put( "ValidStatus",
                new ArrayList<String>(
                        Arrays.asList( "BASE", "ACID", "NEUTRAL", "NONE" )
                )
        );

        properties.put(colorProp);
        properties.put(phStatusProp);

        toolJSONObject.put( "Prop",properties );


        //final property
        JSONArray finalProperties = new JSONArray();

        JSONObject finalColorProp = new JSONObject();
        finalColorProp.put( "Name","Color" );
        finalColorProp.put( "Value",this.finalColor );
        finalColorProp.put( "Editable", false );
        finalColorProp.put( "ValidColor",
                new ArrayList<String>(
                        Arrays.asList( "#6a0dad", "#ff0000","#005E57","#ffffff" )
                )
        );

        JSONObject finalPhStatusProp = new JSONObject();
        finalPhStatusProp.put( "Name","PH Status" );
        finalPhStatusProp.put( "Value",this.finalPhStatus );
        finalPhStatusProp.put( "Editable", true );
        finalPhStatusProp.put( "ValidStatus",
                new ArrayList<String>(
                        Arrays.asList( "BASE", "ACID", "NEUTRAL", "NONE" )
                )
        );

        finalProperties.put(finalColorProp);
        finalProperties.put( finalPhStatusProp );

        toolJSONObject.put( "FinalProp",finalProperties );

        JSONObject interactions = new JSONObject();
        interactions.put("Name", "Measure");

        toolJSONObject.put( "Interactions",interactions );

        return  toolJSONObject;

    }

    public boolean updateProp(String toolProps){

       // System.out.println( "called"+this.phStatus );

        JSONObject jsonObject = new JSONObject(toolProps);
        JSONObject cTool = jsonObject.getJSONObject( "ctool" );

        if (cTool.get( "x" ) instanceof Double){
            this.x = (int)((double) cTool.get( "x" ));
        }else {
            this.x = (int) cTool.get( "x" );
        }

        if (cTool.get( "y" ) instanceof Double){
            this.y = (int)((double) cTool.get( "y" ));
        }else {
            this.y = (int) cTool.get( "y" );
        }

        this.nickName = (String)cTool.get( "nickname" );

        JSONArray propArray = cTool.getJSONArray( "Prop" );

        propArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
           if (((String)prop.get("Name")).equals( "Color" )){
                this.color=(String) prop.get( "Value" );
           }
           else if (((String)prop.get("Name")).equals( "PH Status" )){
               this.phStatus= (String) prop.get( "Value" );
               //System.out.println( "aaaaa: "+ prop.get( "Value" ) );
           }

        } );

        JSONArray finalPropArray = cTool.getJSONArray( "FinalProp" );

        finalPropArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
            if (((String)prop.get("Name")).equals( "Color" )){
                this.finalColor=(String) prop.get( "Value" );
            }
            else if (((String)prop.get("Name")).equals( "PH Status" )){
                this.finalPhStatus= (String) prop.get( "Value" );
            }
        } );

        //"BASE", "ACID", "NEUTRAL", "NONE"
        //"#6a0dad", "#ff0000","#005E57","#ffffff"

        if (this.finalPhStatus.equals( "BASE" ))
            this.finalColor = "#6a0dad";
        else if(this.finalPhStatus.equals( "ACID" ))
            this.finalColor = "#ff0000";
        else if(this.finalPhStatus.equals( "NEUTRAL" ))
            this.finalColor = "#005E57";
        else if(this.finalPhStatus.equals( "NONE" ))
            this.finalColor = "#ffffff";

        return true;

    }

    public boolean measurePh(Tool tool){

        if (tool.getName().equals( "Beaker" )) {


            Beaker toMeasure = (Beaker) tool;

            this.phStatus = toMeasure.getPhStatus();

            if (this.phStatus.equals( "BASE" ))
                this.color = "#6a0dad";
            else if(this.phStatus.equals( "ACID" ))
                this.color = "#ff0000";
            else if(this.phStatus.equals( "NEUTRAL" ))
                this.color = "#005E57";
            else if(this.phStatus.equals( "NONE" ))
                this.color = "#ffffff";

            return true;
        }else {

            Flask toMeasure = (Flask) tool;

            this.phStatus = toMeasure.getPhStatus();

            if (this.phStatus.equals( "BASE" ))
                this.color = "#6a0dad";
            else if(this.phStatus.equals( "ACID" ))
                this.color = "#ff0000";
            else if(this.phStatus.equals( "NEUTRAL" ))
                this.color = "#005E57";
            else if(this.phStatus.equals( "NONE" ))
                this.color = "#ffffff";

            return true;
        }

    }

    public JSONObject getInteractionDetail(String interactionName){
        JSONObject interactionJSONObject = new JSONObject();

        if (interactionName.equals("Measure")){
            interactionJSONObject.put( "Name",interactionName );
            interactionJSONObject.put( "Description","Measure chemical PH status" );
            //JSONObject pourPrams = new JSONObject();
            interactionJSONObject.put( "Prams",this.phStatus );
        }

        return interactionJSONObject;

    }

    public PHPaper clone() throws CloneNotSupportedException {
        PHPaper clone = (PHPaper) super.clone();
        clone.setColor(this.getColor());
        clone.setFinalColor( this.finalColor );
        clone.setPhStatus( this.phStatus );
        clone.setFinalPhStatus( this.finalPhStatus );
        return clone;
    }

}
