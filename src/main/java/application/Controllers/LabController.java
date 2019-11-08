package application.Controllers;

import application.LabCreation.MakeLab;
import application.Models.Lab;
import application.Models.Tool;
import application.Models.User;
import application.Models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class LabController {

    MakeLab lab;

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

    @GetMapping("/gettools")
    @ResponseBody
    public List<Tool> getTools() {
        System.out.println("2");
        return lab.getTools();
    }


}
