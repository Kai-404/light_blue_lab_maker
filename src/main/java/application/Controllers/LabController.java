package application.Controllers;

import application.Models.Lab;
import application.Models.Stage;
// Not the real JSON Library!!!
//import net.minidev.json.JSONArray;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class LabController {

    //Lab object that gets modified when creating a lab
    Lab lab;

    //sets lab to a new lab object
    @PostMapping("/newlab")
    @ResponseBody
    public Lab newLab(@RequestBody Lab newLab) {
        lab = new Lab(newLab.getTitle(), newLab.getAuthor());
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
    public Lab addStage(@RequestBody Stage currentStage) {
        lab.addStage(currentStage.getStageNum());
        return lab;
    }

    //deletes stage currentStage
    @PostMapping("/deletestage")
    @ResponseBody
    public Lab deleteStage(@RequestBody Stage currentStage) {
        lab.deleteStage(currentStage.getStageNum());
        return lab;
    }

    //returns list of all tools
    @GetMapping("/getalltools")
    @ResponseBody
    public String getAllTools() {
        lab = new Lab("Kai's test lab","Kai");
        System.out.println( lab.getToolWarehouse().toString() );
        return  lab.getToolWarehouse().toString();

    }

//    @GetMapping("/test")
//    @ResponseBody
//    public void test(){
//        getAllTools();
//        lab.updateToolWareHouse( lab.getToolWarehouse() );
//    }

    @PostMapping("/updatetoollist")
    @ResponseBody
    public String updateToolList(@RequestBody String toolList){
        lab.updateToolWareHouse(toolList);
        return  lab.getToolWarehouse().toString();
    }

//    //adds a tool to the whole lab
//    @PostMapping("/addlabtool")
//    @ResponseBody
//    public Lab addLabTool(@RequestBody String tool) {
//        lab.addLabTool(tool);
//        return lab;
//    }
//
//    //adds a tool to one stage
//    @PostMapping("/addstagetool")
//    @ResponseBody
//    public Lab addStageTool(@RequestBody String tool, @RequestBody Integer currentStage) {
//        lab.addStageTool(tool, currentStage);
//        return lab;
//    }

}