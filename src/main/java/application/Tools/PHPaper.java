package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;

public class PHPaper extends Tool {

    String name = "PHPaper";
    final String imageName = "ph.png";
    float x = 0;
    float y = 0;
    String color = "green";

    public PHPaper(){

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

        JSONArray interactions = new JSONArray();
        interactions.put("Measure");

        toolJSONObject.put( "Interactions",interactions );

        return  toolJSONObject;

    }

}
