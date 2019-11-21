package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Beaker extends Tool {
    @Field("BeakerName")
    String name = "Beaker";
    @Field("BeakerImageName")
    final String imageName = "beaker.png";
    @Field("BeakerX")
    int x = 0;
    @Field("BeakerY")
    int y = 0;

    //initial property
    int size = 100;
    String color = "black";

    //final property
    int finalSize = 50;
    String finalColor = "green";

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

        //initial property
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

        //final property
        JSONArray finalProperties = new JSONArray();

        JSONObject finalSizeProp = new JSONObject();
        finalSizeProp.put( "Name","Size" );
        finalSizeProp.put( "Value",this.finalSize );
        finalSizeProp.put( "Editable", true );

        JSONObject finalColorProp = new JSONObject();
        finalColorProp.put( "Name","Color" );
        finalColorProp.put( "Value",this.finalColor );
        finalColorProp.put( "Editable", true );

        finalProperties.put(finalSizeProp);
        finalProperties.put(finalColorProp);

        toolJSONObject.put( "FinalProp",finalProperties );


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

        System.out.println( propArray );

        propArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
            if ( ((String)prop.get("Name")).equals( "Size" ) ){
                if (prop.get( "Value" ) instanceof String){
                    this.size= Integer.parseInt((String) prop.get( "Value" ));
                }else {
                    this.size= (int)prop.get( "Value" );
                }
            }else if (((String)prop.get("Name")).equals( "Color" )){
                this.color=(String) prop.get( "Value" );
            }
        } );


        JSONArray finalPropArray = cTool.getJSONArray( "FinalProp" );

        System.out.println( finalPropArray );

        finalPropArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
            if ( ((String)prop.get("Name")).equals( "Size" ) ){
                if (prop.get( "Value" ) instanceof String){
                    this.finalSize= Integer.parseInt((String) prop.get( "Value" ));
                }else {
                    this.finalSize= (int)prop.get( "Value" );
                }
            }else if (((String)prop.get("Name")).equals( "Color" )){
                this.finalColor=(String) prop.get( "Value" );
            }
        } );

    }

    public Beaker clone() throws CloneNotSupportedException {
        Beaker clone = (Beaker) super.clone();
        clone.setSize(this.getSize());
        clone.setColor(this.getColor());
        return clone;
    }

}
