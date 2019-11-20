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

import java.io.IOException;

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
    public Lab newLab(@RequestParam String title, @RequestParam String author) throws IOException {
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
    public void addStage(@RequestBody int stageNum) {
        lab.addStage(stageNum);
    }


    //TODO: deletes stage currentStage
    @PostMapping("/deletestage")
    @ResponseBody
    public void deleteStage(@RequestBody int stageNum) {
        lab.deleteStage(stageNum);
    }

    @PostMapping("/duplicatestage")
    @ResponseBody
    public void duplicateStage(@RequestBody int stageNum) {
        try {
            lab.duplicateStage(stageNum);
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }

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
    public boolean stageAddTool(@RequestParam int stageNum, @RequestParam String toolName){
        return lab.getStage( stageNum ).addTool(toolName);
    }

    @PostMapping("/stagedeletetool")
    @ResponseBody
    public String stagedeleteTool(@RequestParam int stageNum, @RequestParam String ID){
        lab.getStage( stageNum ).deleteTool( ID );
        return getStage( stageNum );
    }


    @PostMapping("/getstage")
    @ResponseBody
    public String getStage(@RequestBody int stageNum){
        return lab.getStage( stageNum ).getStageAsJSON().toString();
    }

    @PostMapping("/gettool")
    @ResponseBody
    public String getTool(@RequestParam int stageNum, @RequestParam String ID){
        return lab.getStage( stageNum ).getTool( ID ).toString();
    }

    @GetMapping("/gettotalstage")
    @ResponseBody
    public int getTotalStage(){
        return lab.getTotalStage();
    }

    @PostMapping("/updatetoolprop")
    @ResponseBody
    public String updateStageToolProp(@RequestBody String toolProps, @RequestParam int stageNum, @RequestParam String ID){
        System.out.println( "Stage Num: "+stageNum+"\nTool ID: "+ ID+"\n prop: "+toolProps);
        lab.getStage( stageNum ).updateToolProp( ID, toolProps );
        return lab.getStage( stageNum ).getStageAsJSON().toString();
    }
//    public void updateStageToolProp(@RequestParam int stageNum, @RequestParam String ID, @RequestBody String toolProps){
//        System.out.println( "Stage Num: "+stageNum+"Tool ID: "+ ID+" prop: "+toolProps);
////        lab.getStage( stageNum ).updateToolProp( ID, toolProps );
////        return lab.getStage( stageNum ).getStageAsJSON().toString();
//    }

    @GetMapping("/savelab")
    @ResponseBody
    public void saveLab() {
        labRepository.save(lab);
    }

    public void publishLab() {
        lab.setPublished(true);
    }

    public void deleteLab() {
        labRepository.delete(lab);
    }

}