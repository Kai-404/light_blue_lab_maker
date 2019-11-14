package application.Controllers;

import application.Models.Lab;
import application.Models.LabRepository;
import application.Models.Stage;
// Not the real JSON Library!!!
//import net.minidev.json.JSONArray;
import application.Tools.Beaker;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class LabController {
    @Autowired
            private LabRepository labRepository;
    //Lab object that gets modified when creating a lab
    Lab lab;

    //sets lab to a new lab object
    @PostMapping("/newlab")
    @ResponseBody
    public Lab newLab(@RequestParam String title, @RequestParam String author) {
        //System.out.println( "a:"+title+"\n"+"b:"+author );
        lab = new Lab(title, author);
        return lab;
    }

    //returns lab object
    @GetMapping("/getlab")
    @ResponseBody
    public Lab getLab() {
        return lab;
    }

    //adds a stage to the lab and returns updated lab
    @PostMapping("/addstage")
    @ResponseBody
    public void addStage() {
        lab.addStage();
    }


    //TODO: deletes stage currentStage
//    @PostMapping("/deletestage")
//    @ResponseBody
//    public Lab deleteStage(@RequestBody Stage currentStage) {
//        lab.deleteStage(currentStage.getStageNum());
//        return lab;
//    }

    //returns list of all tools
    @GetMapping("/getalltools")
    @ResponseBody
    public String getAllTools() {
        //lab = new Lab("Kai's test lab","Kai");
        System.out.println( lab.getToolWarehouse().toString() );

//        Beaker b = new Beaker();
//        System.out.println(b.getToolAsJSON().toString());
        return  lab.getToolWarehouse().toString();

    }

    @PostMapping("/updatetoollist")
    @ResponseBody
    public String updateToolList(@RequestBody String toolList){
        lab.updateToolWareHouse(toolList);
        return  lab.getToolWarehouse().toString();
    }


    @PostMapping("/stageaddtool")
    @ResponseBody
    public boolean stageAddTool(@RequestParam int stageNum, @RequestParam String toolName, @RequestParam String ID ){
        return lab.getStage( stageNum ).addTool(toolName,ID);
    }


    @PostMapping("/getstage")
    @ResponseBody
    public String getStage(@RequestBody int stageNum){
        System.out.println("getting post rrequest: " + stageNum);
        return lab.getStage( stageNum ).getStageAsJSON().toString();
    }

    @PostMapping("/gettool")
    @ResponseBody
    public String getTool(@RequestParam int stageNum, @RequestParam String ID){
        return lab.getStage( stageNum ).getTool( ID ).toString();
    }

    @GetMapping("/gettotalstage")
    @ResponseBody
    public int getTool(){
        return lab.getTotalStage();
    }





//
//    //adds a tool to one stage
//    @PostMapping("/addstagetool")
//    @ResponseBody
//    public Lab addStageTool(@RequestBody String tool, @RequestBody Integer currentStage) {
//        lab.addStageTool(tool, currentStage);
//        return lab;
//    }
    public void saveLab() {
        labRepository.save(lab);
    }

    public void deleteLab() {
        labRepository.delete(lab);
    }
}