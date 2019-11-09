package application.Controllers;

import application.LabCreation.MakeLab;
import application.Models.Lab;
import application.Models.Tool;
import application.Models.User;
import application.Models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
public class LabController {

    MakeLab lab;
    Lab aLab = new Lab();

    @PostMapping("/newlab")
    @ResponseBody
    public MakeLab newLab(@RequestBody LabDTO labdto) {
        System.out.println("1");
        lab = new MakeLab(labdto.getTitle(), labdto.getAuthor());
        return lab;
    }

    @GetMapping("/getlab")
    @ResponseBody
    public Lab getLab() {
        return lab.getLab();
    }

    @PostMapping("/addstage")
    @ResponseBody
    public Lab addStage() {
        lab.addStage();
        return lab.getLab();
    }

    @RequestMapping("/gettoollist")
    @ResponseBody
    public HashMap<String,Boolean> toolList(){
        aLab.initToolList();

        return aLab.getToolList();
    }

}
