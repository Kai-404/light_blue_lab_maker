package application.Tools;

import application.Models.Tool;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@Getter
@Setter
public class Pipette extends Tool {
    @Field("PipetteName")
    String name = "Pipette";
    @Field("PipetteImageName")
    final String imageName = "pipette.png";
    @Field("PipetteX")
    int x = 0;
    @Field("PipetteY")
    int y = 0;
    @Field("PipetteNickName")
    String nickName = "Pipette";

    //initial property
    double maxVolume = 10.0;
    ArrayList<String> currentChemicalsList = new ArrayList<>( );
    String phStatus = "NONE";
    boolean sucked = false;

    //final property
    double finalMaxVolume = 10.0;
    ArrayList<String> finalCurrentChemicalsList = new ArrayList<>();
    String finalPhStatus = "NONE";
    boolean finalSucked = false;



    @Field("PipetteInteractWith")
    Map<String,String> canInteractWith = Map.of(
            "Beaker","SuckOrDrop",
            "Flask","SuckOrDrop"
    );



    public Pipette(){

    }
    public String getName(){
        return this.name;
    }


    @Override
    public String getImageName() {
        return imageName;
    }

    public String chemicalListToString(ArrayList<String> list){
        String toReturn;
        toReturn = String.join( "," ,list );
        return toReturn;
    }

    public ArrayList<String> chemicalStringToList(String chemicalString){

        ArrayList<String> chemicalList = new ArrayList();

        if (! chemicalString.equals( "" ) ){
            chemicalList = new ArrayList(Arrays.asList( chemicalString.split( "," )));
        }

        if (!chemicalList.isEmpty()){
            for(String s : chemicalList){
                if (s.isBlank()){
                    chemicalList.remove( s );
                }
            }
        }

        return chemicalList;
    }


    public JSONObject getToolAsJSON(){

        JSONObject toolJSONObject = new JSONObject();
        toolJSONObject.put( "id",this.id );
        toolJSONObject.put( "Name",this.name );
        toolJSONObject.put( "Img",this.imageName );
        toolJSONObject.put( "x",this.x );
        toolJSONObject.put( "y",this.y );
        toolJSONObject.put( "nickname",this.nickName );

        //initial property
        JSONArray properties = new JSONArray();

        JSONObject maxVolumeProp = new JSONObject();
        maxVolumeProp.put( "Name","Capacity" );
        maxVolumeProp.put( "Value",this.maxVolume );
        maxVolumeProp.put( "Editable", false );
        maxVolumeProp.put( "Max", "9999" );
        maxVolumeProp.put( "Min", "1" );

//        JSONObject currentVolumeProp = new JSONObject();
//        currentVolumeProp.put( "Name","Current Volume" );
//        currentVolumeProp.put( "Value",this.currentVolume );
//        currentVolumeProp.put( "Editable", true );
//        currentVolumeProp.put( "Max", "9999" );
//        currentVolumeProp.put( "Min", "1" );

        JSONObject phStatusProp = new JSONObject();
        phStatusProp.put( "Name","PH Status" );
        phStatusProp.put( "Value",this.phStatus );
        phStatusProp.put( "Editable", false );
        phStatusProp.put( "ValidStatus",
                new ArrayList<String>(
                        Arrays.asList( "BASE", "ACID", "NEUTRAL", "NONE" )
                )
        );

        JSONObject chemicalsListProp = new JSONObject();
        chemicalsListProp.put( "Name","Chemicals List" );
        chemicalsListProp.put( "Value",chemicalListToString( this.currentChemicalsList ) );
        chemicalsListProp.put( "Editable", false );

        properties.put(maxVolumeProp);
        //properties.put(currentVolumeProp);
        properties.put(phStatusProp);
        properties.put(chemicalsListProp);

        toolJSONObject.put( "Prop",properties );

        //final property
        JSONArray finalProperties = new JSONArray();

        JSONObject finalMaxVolumeProp = new JSONObject();
        finalMaxVolumeProp.put( "Name","Capacity" );
        finalMaxVolumeProp.put( "Value",this.finalMaxVolume );
        finalMaxVolumeProp.put( "Editable", false );
        finalMaxVolumeProp.put( "Max", "9999" );
        finalMaxVolumeProp.put( "Min", "1" );

//        JSONObject finalCurrentVolumeProp = new JSONObject();
//        finalCurrentVolumeProp.put( "Name","Current Volume" );
//        finalCurrentVolumeProp.put( "Value",this.finalCurrentVolume );
//        finalCurrentVolumeProp.put( "Editable", true );
//        finalCurrentVolumeProp.put( "Max", "9999" );
//        finalCurrentVolumeProp.put( "Min", "1" );

        JSONObject finalPhStatusProp = new JSONObject();
        finalPhStatusProp.put( "Name","PH Status" );
        finalPhStatusProp.put( "Value",this.finalPhStatus );
        finalPhStatusProp.put( "Editable", true );
        finalPhStatusProp.put( "ValidStatus",
                new ArrayList<String>(
                        Arrays.asList( "BASE", "ACID", "NEUTRAL", "NONE" )
                )
        );

        JSONObject finalChemicalsListProp = new JSONObject();
        finalChemicalsListProp.put( "Name","Chemicals List" );
        finalChemicalsListProp.put( "Value",chemicalListToString(this.finalCurrentChemicalsList ));
        finalChemicalsListProp.put( "Editable", true );




        finalProperties.put(finalMaxVolumeProp);
        //finalProperties.put(finalCurrentVolumeProp);
        finalProperties.put(finalPhStatusProp);
        finalProperties.put(finalChemicalsListProp);

        toolJSONObject.put( "FinalProp",finalProperties );


        JSONObject interactions = new JSONObject();
        interactions.put("Name", "Suck or Drop");

        toolJSONObject.put( "Interactions",interactions );

        return  toolJSONObject;

    }

    public boolean updateProp(String toolProps){

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


        AtomicReference<Boolean> updateSuccess = new AtomicReference<>( true );

        propArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
            if ( ((String)prop.get("Name")).equals( "Capacity" ) ){
                double temp = Double.parseDouble( String.valueOf( prop.get( "Value" ) ) );

                if (temp  <0){
                    updateSuccess.set( false );
                }else {
                    this.maxVolume = temp;
                }

            }
//            else if (((String)prop.get("Name")).equals( "Current Volume" )){
//                double temp =  Double.parseDouble( String.valueOf( prop.get( "Value" ) ) );
//
//                if (temp > this.maxVolume || temp <0){
//                    updateSuccess.set( false );
//                }else {
//                    this.currentVolume = temp;
//                }
//
//            }
            else if (((String)prop.get("Name")).equals( "PH Status" )){
                this.phStatus= (String) prop.get( "Value" );
            }
            else if (((String)prop.get("Name")).equals( "Chemicals List" )){
                this.currentChemicalsList = chemicalStringToList((String) prop.get( "Value" ) );
            }
        } );


        JSONArray finalPropArray = cTool.getJSONArray( "FinalProp" );

        //System.out.println( finalPropArray );

        finalPropArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
            if ( ((String)prop.get("Name")).equals( "Capacity" ) ){

                double temp = Double.parseDouble( String.valueOf( prop.get( "Value" ) ) );

                if (temp  != this.maxVolume){
                    updateSuccess.set( false );
                }else {
                    this.finalMaxVolume = temp;
                }

            }
            else if (((String)prop.get("Name")).equals( "PH Status" )){
                this.finalPhStatus= (String) prop.get( "Value" );
            }
            else if (((String)prop.get("Name")).equals( "Chemicals List" )){
                this.finalCurrentChemicalsList = chemicalStringToList((String) prop.get( "Value" ) );
            }
        } );


        return updateSuccess.get();

    }

    public Pipette clone() throws CloneNotSupportedException {
        Pipette clone = (Pipette) super.clone();
        clone.setMaxVolume(this.maxVolume);
        //clone.setCurrentVolume(this.currentVolume);
        clone.setCurrentChemicalsList( this.currentChemicalsList );
        clone.setPhStatus( this.phStatus );

        clone.setFinalMaxVolume(this.finalMaxVolume);
        //clone.setFinalCurrentVolume(this.finalCurrentVolume);
        clone.setFinalCurrentChemicalsList( this.finalCurrentChemicalsList );
        clone.setFinalPhStatus( this.finalPhStatus );
        return clone;
    }

    public boolean suckOrDrop(Tool tool){

        //drop
        if (sucked){
            if (tool.getName().equals( "Beaker" )) {
                Beaker pourTo = (Beaker) tool;
                if((pourTo.getCurrentVolume()+10.0) > pourTo.getMaxVolume()){
                    return false;
                }else {
                    if(! this.phStatus.equals( "NEUTRAL" )){
                        if(10.0>pourTo.currentVolume){
                            pourTo.phStatus = this.phStatus;
                        }else if(10.0 == pourTo.currentVolume){
                            if (! this.phStatus.equals( pourTo.getPhStatus())){
                                if(pourTo.phStatus.equals( "NEUTRAL" )){
                                    pourTo.phStatus=this.phStatus;
                                } else {
                                    pourTo.phStatus="NEUTRAL";
                                }
                            }
                        } else if(pourTo.phStatus.equals("NEUTRAL")){
                            pourTo.phStatus = this.phStatus;
                        }
                    }

                    for (String s : this.currentChemicalsList){
                        if (!pourTo.currentChemicalsList.contains(s))
                            pourTo.currentChemicalsList.add( s );
                    }
                    pourTo.currentVolume = pourTo.currentVolume + 10.0;
                    this.sucked = false;
                    this.currentChemicalsList = new ArrayList<>(  );
                    this.phStatus = "NONE";
                    return true;
                }
            }else {
                System.out.println( "It's a Flask" );
                Flask pourTo = (Flask) tool;
                if((pourTo.getCurrentVolume()+10.0) > pourTo.getMaxVolume()){
                    return false;
                }else {
                    if(! this.phStatus.equals( "NEUTRAL" )){
                        if(10.0>pourTo.currentVolume){
                            pourTo.phStatus = this.phStatus;
                        }else if(10.0 == pourTo.currentVolume){
                            if (! this.phStatus.equals( pourTo.getPhStatus())){
                                if(pourTo.phStatus.equals( "NEUTRAL" )){
                                    pourTo.phStatus=this.phStatus;
                                } else {
                                    pourTo.phStatus="NEUTRAL";
                                }
                            }
                        } else if(pourTo.phStatus.equals("NEUTRAL")){
                            pourTo.phStatus = this.phStatus;
                        }
                    }

                    for (String s : this.currentChemicalsList){
                        if (!pourTo.currentChemicalsList.contains(s))
                            pourTo.currentChemicalsList.add( s );
                    }
                    pourTo.currentVolume = pourTo.currentVolume + 10.0;
                    this.sucked = false;
                    this.currentChemicalsList = new ArrayList<>(  );
                    this.phStatus = "NONE";
                    return true;
                }
            }
        }else {//Suck
            if (tool.getName().equals( "Beaker" )) {
                Beaker suckFrom = (Beaker) tool;
                if((suckFrom.getCurrentVolume()-10.0) <0){
                    return false;
                }else {
                    this.phStatus = suckFrom.phStatus;
                    this.currentChemicalsList = suckFrom.currentChemicalsList;

                    this.sucked = true;
                    suckFrom.currentVolume = suckFrom.currentVolume-10.0;

                    if (suckFrom.currentVolume ==0){
                        suckFrom.phStatus = "NONE";
                        suckFrom.currentChemicalsList = new ArrayList<>(  );
                    }

                    return true;
                }
            }else {
                Flask suckFrom = (Flask) tool;
                if((suckFrom.getCurrentVolume()-10.0) <0){
                    return false;
                }else {
                    this.phStatus = suckFrom.phStatus;
                    this.currentChemicalsList = suckFrom.currentChemicalsList;
                    this.sucked = true;
                    suckFrom.currentVolume = suckFrom.currentVolume-10.0;

                    if (suckFrom.currentVolume ==0){
                        suckFrom.phStatus = "NONE";
                        suckFrom.currentChemicalsList = new ArrayList<>(  );
                    }

                    return true;
                }
            }
        }

    }

    public JSONObject getInteractionDetail(String interactionName){
        JSONObject interactionJSONObject = new JSONObject();

        if (interactionName.equals("SuckOrDrop") && !this.sucked){
            interactionJSONObject.put( "Name", "Suck" );
            interactionJSONObject.put( "Description","Suck chemical from a glassware" );
            //JSONObject pourPrams = new JSONObject();
            interactionJSONObject.put( "Prams", "Suck" );

        }else if (interactionName.equals("SuckOrDrop") && this.sucked){
            interactionJSONObject.put( "Name", "Drop" );
            interactionJSONObject.put( "Description","Drop chemical to a glassware" );
            //JSONObject pourPrams = new JSONObject();
            interactionJSONObject.put( "Prams", "Drop" );
        }

        return interactionJSONObject;

    }

}
