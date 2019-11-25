package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

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

    //initial property
    String color = "#ffffff";
    String phStatus = "NONE";
    //final property
    String finalColor = "#00ff00";
    String finalPhStatus = "Neutral";

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

        JSONArray properties = new JSONArray();

        JSONObject colorProp = new JSONObject();
        colorProp.put( "Name","Color" );
        colorProp.put( "Value",this.color );
        colorProp.put( "Editable", true );

        properties.put(colorProp);

        toolJSONObject.put( "Prop",properties );


        //final property
        JSONArray finalProperties = new JSONArray();

        JSONObject finalColorProp = new JSONObject();
        finalColorProp.put( "Name","Color" );
        finalColorProp.put( "Value",this.finalColor );
        finalColorProp.put( "Editable", true );

        finalProperties.put(finalColorProp);

        toolJSONObject.put( "FinalProp",finalProperties );

        JSONObject interactions = new JSONObject();
        interactions.put("Name", "Measure");

        toolJSONObject.put( "Interactions",interactions );

        return  toolJSONObject;

    }

    public void updateProp(String toolProps){

        JSONObject jsonObject = new JSONObject(toolProps);
        JSONObject cTool = jsonObject.getJSONObject( "ctool" );
        this.x = (int)cTool.get( "x" );
        this.y = (int)cTool.get( "y" );

        JSONArray propArray = cTool.getJSONArray( "Prop" );

        propArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
           if (((String)prop.get("Name")).equals( "Color" )){
                this.color=(String) prop.get( "Value" );
           }
        } );

        JSONArray finalPropArray = cTool.getJSONArray( "FinalProp" );

        finalPropArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
            if (((String)prop.get("Name")).equals( "Color" )){
                this.finalColor=(String) prop.get( "Value" );
            }
        } );

    }

    public PHPaper clone() throws CloneNotSupportedException {
        PHPaper clone = (PHPaper) super.clone();
        clone.setColor(this.getColor());
        return clone;
    }

}
