package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;

public class PHPaper extends Tool {

    String name = "PHPaper";
    final String imageName = "ph.png";
    int x = 0;
    int y = 0;
    String color = "green";

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

    }

}
