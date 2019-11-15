package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;

public class Beaker extends Tool {

    String name = "Beaker";
    final String imageName = "beaker.png";
    int x = 0;
    int y = 0;
    int size = 100;
    String color = "green";

    boolean canBeBurned = true;
    public Beaker(){

    }
    public String getName(){
        return this.name;
    }


    @Override
    public String getImageName() {
        return imageName;
    }

//    [
//    {
//          id: "1",
//          Name: "Beaker",
//          Img: "beakerTool.png",
//          x: 0,
//          y: 0,
//          Prop: [
//              { Name: "Size", Value: "100", Editable: true },
//              { Name: "Color", Value: "Green", Editable: true }
//          ],
//          Interaction: [Pour]
//    },
//    {

//     },
//    {

//     }
//    ]

    public JSONObject getToolAsJSON(){

        JSONObject toolJSONObject = new JSONObject();
        toolJSONObject.put( "id",this.id );
        toolJSONObject.put( "Name",this.name );
        toolJSONObject.put( "Img",this.imageName );
        toolJSONObject.put( "x",this.x );
        toolJSONObject.put( "y",this.y );

        JSONArray properties = new JSONArray();

        JSONObject sizeProp = new JSONObject();
        sizeProp.put( "Name","Size" );
        sizeProp.put( "Value",this.size );
        sizeProp.put( "Editable", true );

        JSONObject colorProp = new JSONObject();
        colorProp.put( "Name","Color" );
        colorProp.put( "Value",this.color );
        colorProp.put( "Editable", true );

        properties.put(sizeProp);
        properties.put(colorProp);

        toolJSONObject.put( "Prop",properties );

        JSONObject interactions = new JSONObject();
        interactions.put("Name", "Pour");

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
            if ( ((String)prop.get("Name")).equals( "Size" ) ){
                this.size= (int) prop.get( "Value" );
            }else if (((String)prop.get("Name")).equals( "Color" )){
                this.color=(String) prop.get( "Value" );
            }
        } );

    }

}
