package application.Controllers;

import application.LabCreation.MakeLab;
import application.Models.Lab;
import application.Models.User;
import application.Models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.ArrayList;
import java.util.List;


@CrossOrigin
@RestController
public class LabController {

    MakeLab lab;

    @PostMapping("/newlab")
    @ResponseBody
    public void newLab(@RequestBody LabDTO labdto) {
        lab = new MakeLab(labdto.getTitle(), labdto.getAuthor());
    }

    @PostMapping("/addstage")
    @ResponseBody
    public Lab addStage() {
        lab.addStage();
        return lab.getLab();
    }

    @RequestMapping("/gettoollist")
    @ResponseBody
    public List<String> toolList(){
        List<String> results = new ArrayList<String>();


        File[] files = new File("./src/main/java/application/Tools").listFiles();

        for (File file : files) {
            if (file.isFile()) {
                results.add(file.getName());
            }

        }

        return results;
    }

}
