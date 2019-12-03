/*
Removed Tool
 */
package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Field;

public class AlcoholBurner extends Tool {
    @Field("ABname")
    String name = "AlcoholBurner";
    @Field("ABimageName")
    final String imageName = "burner.png";
    @Field("ABx")
    int x = 0;
    @Field("ABy")
    int y = 0;

    public AlcoholBurner(){

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

        toolJSONObject.put( "Prop","No property for this tool!" );

        JSONObject interactions = new JSONObject();
        interactions.put("Name", "Burn");

        toolJSONObject.put( "Interactions",interactions );

        return  toolJSONObject;

    }

    public void updateProp(String toolProps){

        JSONObject jsonObject = new JSONObject(toolProps);

        JSONObject cTool = jsonObject.getJSONObject( "ctool" );
        this.x = (int)cTool.get( "x" );
        this.y = (int)cTool.get( "y" );

        //JSONArray propArray = cTool.getJSONArray( "Prop" );

    }

    @Override
    public AlcoholBurner clone() throws CloneNotSupportedException {
        AlcoholBurner clone = (AlcoholBurner) super.clone();
        return clone;
    }
}
