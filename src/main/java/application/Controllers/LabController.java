package application.Controllers;

import application.Models.*;
import application.Models.Lab;
// Not the real JSON Library!!!
//import net.minidev.json.JSONArray;
import application.Tools.Beaker;
import application.Tools.PHPaper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

@CrossOrigin
@RestController
public class LabController {
    @Autowired
    private LabRepository labRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private CourseRepository courseRepository;

    //Lab object that gets modified when creating a lab
    Lab lab;
    int currentStage = 0;

    //sets lab to a new lab object
    @PostMapping("/newlab")
    @ResponseBody
    public Lab newLab(@RequestParam String title, @RequestParam String author, @RequestParam String description) throws IOException {
        //System.out.println( "a:"+title+"\n"+"b:"+author );
        lab = new Lab(title, author);
        lab.setDescription( description );
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
        //System.out.println( lab.getToolWarehouse().toString() );

//        Beaker b = new Beaker();
//        //System.out.println(b.getToolAsJSON().toString());
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
        //System.out.println( "Stage Num: "+stageNum+"\nTool ID: "+ ID+"\n prop: "+toolProps);
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
    public boolean saveLab(@RequestParam(name="courseID") String courseID) {
        try {
            labRepository.save(lab);
            Course course = courseRepository.getById(courseID);
            if (!course.getLab_list().contains(lab.getId())) {
                course.getLab_list().add(lab.getId());
                courseRepository.save(course);
            }
        } catch (Error e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @GetMapping("/getlablist")
    @ResponseBody
    public List<Lab> getLabList(String courseID) {
        Course course = courseRepository.getById(courseID);
        ArrayList<Lab> labList = new ArrayList<Lab>();
        for (String labID : course.getLab_list()) {
            labList.add(labRepository.getById(labID));
        }
        return labList;
    }

    @GetMapping("/publishlab")
    @ResponseBody
    public boolean publishLab() {
        try {
            lab.setPublished(true);
            labRepository.save(lab);
        } catch (Error e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
    @GetMapping("/deletelab")
    @ResponseBody
    public boolean deleteLab(@RequestParam(name = "id") String id, HttpSession session) {
        Lab lab = labRepository.getById(id);
        if (id != null) {
            labRepository.delete(lab);
            User user = userRepository.findByUsername((String) session.getAttribute("user"));
            Professor professor = professorRepository.findByUserId(user.getId());
            professor.getLab_list().remove(lab.getId());
            return true;
        }
        return false;
    }

    @PostMapping("/saveinstructions")
    @ResponseBody
    public String saveInstructions(@RequestParam(name="stageNum") int stageNum, @RequestParam(name="instructions") String instructions) {
        lab.saveInstructions(stageNum, instructions);
        return instructions;
    }

    @GetMapping("/searchlab")
    @ResponseBody
    public ResponseEntity<List<Lab>> searchLab(@RequestParam(name = "id") String name, @RequestParam(name="courseID") String courseID, HttpSession session) {
        List<Lab> labList = new ArrayList<>();
        User user = userRepository.findByUsername((String) session.getAttribute("user"));
        Course course = courseRepository.getById(courseID);
        for (String id : course.getLab_list()) {
            Lab lab = labRepository.getById(id);
            if (lab != null && lab.getTitle().contains(name))
                labList.add(lab);
        }
        if (labList.size() == 0)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        else
            return new ResponseEntity<>(labList, HttpStatus.OK);
    }

    //ADD DRAGGABLE POSTMAPPING
    @PostMapping("/swapstages")
    @ResponseBody
    public void swapstages(@RequestParam(name="oldIndex") int oldIndex, @RequestParam(name="newIndex") int newIndex) {
        lab.swapStages(oldIndex, newIndex);
    }

    @GetMapping("/editlab")
    @ResponseBody
    public void editlab(@RequestParam(name="id") String id) {
        lab = labRepository.getById(id);
    }

    @PostMapping("/checkInteraction")
    @ResponseBody
    public ResponseEntity<String> checkInteraction(@RequestParam(name="stageNum") int stageNum,
                                                   @RequestParam(name="id") String id,
                                                   @RequestParam(name="id2") String id2) {

        Stage stage = lab.getStage( stageNum );
        Tool tool1 = stage.getToolByID( id );
        Tool tool2 = stage.getToolByID( id2 );

        if (! tool1.getCanInteractWith().containsKey( tool2.getName() )){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }else {
            String interActionName = tool1.getCanInteractWith().get(tool2.getName());
            if (tool1.getName().equals( "Beaker" )){
                Beaker tool = (Beaker) tool1;
                return new ResponseEntity<>(tool.getInteractionDetail(interActionName).toString(), HttpStatus.OK);
            }else if (tool1.getName().equals( "PHPaper" )) {
                PHPaper tool = (PHPaper) tool1;
                return new ResponseEntity<>(tool.getInteractionDetail(interActionName).toString(), HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

        }
    }

////    for test only
//    @GetMapping("/getbeaker")
//    @ResponseBody
//    public String getBeaker() {
////        Beaker beaker = new Beaker();
////        return  beaker.getInteractionDetail( "Pour" ).toString();
//        PHPaper ph = new PHPaper();
//        return  ph.getInteractionDetail( "Measure" ).toString();
//
//    }

    @GetMapping("/setdolab")
    @ResponseBody
    public void setDoLab(@RequestParam(name="id") String id) {
        lab = labRepository.getById(id);
        currentStage = 0;
    }

    @GetMapping("/getdolabstage")
    @ResponseBody
    public String getDoLabStage() {
        return lab.getStage(currentStage).getStageAsJSON().toString();
    }

    @GetMapping("/getcurrentstage")
    @ResponseBody
    public int getCurrentStage(){
        return currentStage;
    }

    @GetMapping("/getnextstage")
    @ResponseBody
    public boolean getNextStage() throws IOException {
        ArrayList<Tool> toolList = lab.getStage(currentStage).getStageToolList();
        for (Tool tool: toolList) {
            HashMap result = new ObjectMapper().readValue(tool.getToolAsJSON().toString(), HashMap.class);
            List initialProperties = (List) result.get("Prop");
            List finalProperties = (List) result.get("FinalProp");
            for (int i=0; i<initialProperties.size();i++) {
                if (!((LinkedHashMap) (initialProperties).get(i)).get("Value").equals(((LinkedHashMap) (finalProperties).get(i)).get("Value"))) {
                    return false;
                }
            }
        }
        ++currentStage;
        return true;
    }
}
