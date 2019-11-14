package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;

public class AlcoholBurner extends Tool {

    String name = "AlcoholBurner";
    final String imageName = "burner.png";
    float x = 0;
    float y = 0;

    public AlcoholBurner(){

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

        toolJSONObject.put( "Prop","No property for this tool!" );

        JSONArray interactions = new JSONArray();
        interactions.put("Burn");

        toolJSONObject.put( "Interactions",interactions );

        return  toolJSONObject;

    }

    public void updateProp(String toolProps){

        JSONObject jsonObject = new JSONObject(toolProps);

        this.x = (float)jsonObject.get( "x" );
        this.y = (float)jsonObject.get( "y" );

    }
}
