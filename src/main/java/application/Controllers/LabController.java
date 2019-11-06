package application.Controllers;

import application.LabCreation.MakeLab;
import application.Models.Lab;
import application.Models.User;
import application.Models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class LabController {

    MakeLab lab;

    @PostMapping("/newlab")
    @ResponseBody
    public void newLab(@RequestBody LabDTO labdto) {
        System.out.println(labdto.getTitle() + " " + labdto.getAuthor());
        lab = new MakeLab(labdto.getTitle(), labdto.getAuthor());
    }

    @PostMapping("/addstage")
    public Lab addStage() {
        lab.addStage();
        return lab.getLab();
    }


}
