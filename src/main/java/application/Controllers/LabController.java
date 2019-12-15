package application.Controllers;

import application.Models.*;
import application.Models.Lab;
// Not the real JSON Library!!!
//import net.minidev.json.JSONArray;
import application.Tools.Beaker;
import application.Tools.Flask;
import application.Tools.PHPaper;
import application.Tools.Pipette;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;

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
    private StudentRepository studentRepository;
    @Autowired
    private CourseRepository courseRepository;

    //Lab object that gets modified when creating a lab
    Lab lab;

    //sets lab to a new lab object
    @PostMapping("/newlab")
    @ResponseBody
    public Lab newLab(@RequestParam String title, @RequestParam String author, @RequestParam String description) throws IOException {
        //System.out.println( "a:"+title+"\n"+"b:"+author );
        lab = new Lab(title, author);
        lab.setDescription(description);
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
        return lab.getToolWarehouse().toString();

    }

    @PostMapping("/updatetoollist")
    @ResponseBody
    public String updateToolList(@RequestBody String toolList) {
        lab.updateToolWareHouse(toolList);
        return lab.getToolWarehouse().toString();
    }


    @PostMapping("/stageaddtool")
    @ResponseBody
    public boolean stageAddTool(@RequestParam int stageNum, @RequestParam String toolName) {
        return lab.getStage(stageNum).addTool(toolName);
    }

    @PostMapping("/stagedeletetool")
    @ResponseBody
    public String stagedeleteTool(@RequestParam int stageNum, @RequestParam String ID) {
        lab.getStage(stageNum).deleteTool(ID);
        return getStage(stageNum);
    }


    @PostMapping("/getstage")
    @ResponseBody
    public String getStage(@RequestBody int stageNum) {
        return lab.getStage(stageNum).getStageAsJSON().toString();
    }

    @PostMapping("/gettool")
    @ResponseBody
    public String getTool(@RequestParam int stageNum, @RequestParam String ID) {
        return lab.getStage(stageNum).getTool(ID).toString();
    }

    @GetMapping("/gettotalstage")
    @ResponseBody
    public int getTotalStage() {
        return lab.getTotalStage();
    }

    @PostMapping("/updatetoolprop")
    @ResponseBody
    public ResponseEntity<String> updateStageToolProp(@RequestBody String toolProps, @RequestParam int stageNum, @RequestParam String ID) {
        //System.out.println( "Stage Num: "+stageNum+"\nTool ID: "+ ID+"\n prop: "+toolProps);


        if (!lab.getStage(stageNum).updateToolProp(ID, toolProps)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(lab.getStage(stageNum).getStageAsJSON().toString(), HttpStatus.OK);

        }

        //return lab.getStage( stageNum ).getStageAsJSON().toString();
    }

    @GetMapping("/savelab")
    @ResponseBody
    public boolean saveLab(@RequestParam(name = "courseID") String courseID, @RequestParam(name = "title") String title, @RequestParam(name = "description") String description) {
        try {
            lab.setTitle(title);
            lab.setDescription(description);
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
    public List<Lab> getLabList(String courseID, String userType) {
        Course course = courseRepository.getById(courseID);
        ArrayList<Lab> labList = new ArrayList<Lab>();
        for (String labID : course.getLab_list()) {
            Lab lab = labRepository.getById(labID);
            if (userType.equals("Student")) {
                if (lab.isPublished()) {
                    labList.add(lab);
                }
            } else {
                labList.add(lab);
            }
        }
        return labList;
    }

    @GetMapping("/getallstudentprogress")
    @ResponseBody
    public HashMap<String, Integer> getAllStudentProgress(String id) {
        Student student = studentRepository.findByUserId(id);
        return student.getLabProgress();
    }

    @GetMapping("/getstudentprogress")
    @ResponseBody
    public int getStudentProgress(String id) {
        Student student = studentRepository.findByUserId(id);
        return student.getLabProgress().get(lab.getId());
    }

    @GetMapping("/publishlab")
    @ResponseBody
    public int publishLab(@RequestParam(name = "courseID") String courseID) {
        if (lab.getStageList().size() == 0) {
            return 1;
        }
        for (Stage stage : lab.getStageList()) {
            if (stage.getStageToolList().size() == 0) {
                return 2;
            }
            if (stage.getInstructions().equals("")) {
                return 4;
            }
        }
        try {
            lab.setPublished(true);
            labRepository.save(lab);
            //Update student's lab list
            Course course = courseRepository.getById(courseID);
            for (String id : course.getStudent_list()) {
                Student student = studentRepository.findByUserId(id);
                student.getLabProgress().put(lab.getId(), 0); //set current progress to 0
                HashMap<Integer, Integer> grade = new HashMap<>();
                for (int i = 0; i < lab.getTotalStage(); i++) {
                    grade.put(i, 0);
                }
                student.getGrade().put(lab.getId(), grade); //create grades for a lab
                studentRepository.save(student);
            }
        } catch (Error e) {
            e.printStackTrace();
            return 3;
        }
        return 0;
    }

    @GetMapping("/deletelab")
    @ResponseBody
    public boolean deleteLab(@RequestParam(name = "labID") String labID, @RequestParam(name = "userID") String userID, @RequestParam(name = "courseID") String courseID) {
        Lab lab = labRepository.getById(labID);
        labRepository.delete(lab);
        Course course = courseRepository.getById(courseID);
        course.getLab_list().remove(labID);
        courseRepository.save(course);
        return true;
    }

    @PostMapping("/saveinstructions")
    @ResponseBody
    public String saveInstructions(@RequestParam(name = "stageNum") int stageNum, @RequestParam(name = "instructions") String instructions) {
        lab.saveInstructions(stageNum, instructions);
        return instructions;
    }

    @GetMapping("/searchlab")
    @ResponseBody
    public ResponseEntity<List<Lab>> searchLab(@RequestParam(name = "id") String name, @RequestParam(name = "courseID") String courseID, HttpSession session) {
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
    public void swapstages(@RequestParam(name = "oldIndex") int oldIndex, @RequestParam(name = "newIndex") int newIndex) {
        lab.swapStages(oldIndex, newIndex);
    }

    @GetMapping("/editlab")
    @ResponseBody
    public void editlab(@RequestParam(name = "id") String id) {
        lab = labRepository.getById(id);
    }

    @PostMapping("/checkInteraction")
    @ResponseBody
    public ResponseEntity<String> checkInteraction(@RequestParam(name = "stageNum") int stageNum,
                                                   @RequestParam(name = "id") String id,
                                                   @RequestParam(name = "id2") String id2) {

        Stage stage = lab.getStage(stageNum);
        Tool tool1 = stage.getToolByID(id);
        Tool tool2 = stage.getToolByID(id2);

        if (!tool1.getCanInteractWith().containsKey(tool2.getName())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            String interActionName = tool1.getCanInteractWith().get(tool2.getName());
            if (tool1.getName().equals("Beaker")) {
                Beaker tool = (Beaker) tool1;
                return new ResponseEntity<>(tool.getInteractionDetail(interActionName).toString(), HttpStatus.OK);
            }else if(tool1.getName().equals( "Flask" )){
                Flask tool = (Flask) tool1;
                return new ResponseEntity<>(tool.getInteractionDetail(interActionName).toString(), HttpStatus.OK);
            }else if (tool1.getName().equals( "Pipette" )){
                Pipette tool = (Pipette) tool1;
                tool.suckOrDrop( tool2 );
                return new ResponseEntity<>(tool.getInteractionDetail(interActionName).toString(), HttpStatus.OK);
            }else if (tool1.getName().equals( "PHPaper" )) {
                PHPaper tool = (PHPaper) tool1;
                tool.measurePh( tool2 );
//                System.out.println( tool.getId() );
//                System.out.println( tool.getToolAsJSON().toString() );
                return new ResponseEntity<>(tool.getInteractionDetail(interActionName).toString(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

        }
    }

    @PostMapping("/doInteraction")
    @ResponseBody
    public void doInteraction(@RequestParam(name = "stageNum") int stageNum,
                              @RequestParam(name = "id") String id,
                              @RequestParam(name = "id2") String id2,
                              @RequestParam(name = "interaction") String interaction) {


        System.out.println("Get From Zoe: " + "\n" + stageNum + "\n" + id + "\n" + id2 + "\n" + interaction);
        Stage stage = lab.getStage(stageNum);
        stage.doInteraction(id, id2, interaction);


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
    public void setDoLab(@RequestParam(name = "labID") String labID) {
        lab = labRepository.getById(labID);
    }

    @GetMapping("/getdolabstage")
    @ResponseBody
    public String getDoLabStage(@RequestParam(name = "id") String id, @RequestParam(name = "userType") String userType) {
        if (userType.equals("Student")) {
            Student student = studentRepository.findByUserId(id);
            if (student.getLabProgress().get(lab.getId()) == lab.getTotalStage()) {
                return lab.getStage(lab.getTotalStage() - 1).getStageAsJSON().toString();
            }
            return lab.getStage(student.getLabProgress().get(lab.getId())).getStageAsJSON().toString();
        }
        return lab.getStage(0).getStageAsJSON().toString();
    }

    @GetMapping("/resetlabstage")
    @ResponseBody
    public String resetLabStage(@RequestParam(name = "stageNum") int stageNum) {
        lab.getStageList().set(stageNum, labRepository.getById(lab.getId()).getStage(stageNum));
        return lab.getStageList().get(stageNum).getStageAsJSON().toString();
    }

    @GetMapping("/getnextstage")
    @ResponseBody
    public String getNextStage(@RequestParam(name = "stageNum") int stageNum) {
        return lab.getStage(stageNum + 1).getStageAsJSON().toString();
    }

    @GetMapping("/dolabcheckstage")
    @ResponseBody
    public boolean doLabCheckStage(@RequestParam(name = "stageNum") int stageNum, @RequestParam(name = "id") String id, @RequestParam(name = "userType") String userType) throws IOException {
        Student student = null;
        if (userType.equals("Student")) {
            student = studentRepository.findByUserId(id);
        }
        ArrayList<Tool> toolList = lab.getStage(stageNum).getStageToolList();
        for (Tool tool : toolList) {
            HashMap result = new ObjectMapper().readValue(tool.getToolAsJSON().toString(), HashMap.class);
            List initialProperties = (List) result.get("Prop");
            List finalProperties = (List) result.get("FinalProp");
            for (int i = 0; i < initialProperties.size(); i++) {
                System.out.println(((LinkedHashMap) (initialProperties).get(i)).get("Value"));
                System.out.println(((LinkedHashMap) (finalProperties).get(i)).get("Value"));
                CHECK:
                if (!((LinkedHashMap) (initialProperties).get(i)).get("Value").equals(((LinkedHashMap) (finalProperties).get(i)).get("Value"))) {

                    if (((LinkedHashMap) (finalProperties).get(i)).get("Name") . equals( "Chemicals List" )){

                        String initString = (String) ((LinkedHashMap) (initialProperties).get(i)).get("Value");
                        ArrayList<String> one = new ArrayList( Arrays.asList( initString.split( "," )));

                        String finalString = (String) ((LinkedHashMap) (finalProperties).get(i)).get("Value");
                        ArrayList<String> two = new ArrayList( Arrays.asList( finalString.split( "," )));

                        Collections.sort( one );
                        Collections.sort( two );

                        if (one.equals( two )){
                            break CHECK;
                        }
                    }

                    if (student != null && stageNum == (student.getLabProgress().get(lab.getId()))) {
                        HashMap<Integer, Integer> labGrade = student.getGrade().get(lab.getId());
                        labGrade.put(stageNum, labGrade.get(stageNum) + 1);
                        studentRepository.save(student);
                    }
                    return false;
                }
            }
        }
        if (student != null && stageNum == (student.getLabProgress().get(lab.getId()))) {
            student.getLabProgress().put(lab.getId(), student.getLabProgress().get(lab.getId()) + 1);
            student.getGrade().get(lab.getId()).put(stageNum, student.getGrade().get(lab.getId()).get(stageNum)+1);
            studentRepository.save(student);
        }
        return true;
    }
}
