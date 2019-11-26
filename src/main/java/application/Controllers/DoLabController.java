package application.Controllers;

import application.Models.*;
import application.Models.Lab;
import application.Tools.Beaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
public class DoLabController {

    @Autowired
    private LabRepository labRepository;

    Lab doLab;
    int currentStage = 0;

    @GetMapping("/setdolab")
    @ResponseBody
    public void setDoLab(@RequestParam(name="id") String id) {
        doLab = labRepository.getById(id);
        System.out.println(doLab);
        System.out.println("1");
    }

    @GetMapping("/getdolabstage")
    @ResponseBody
    public String getDoLabStage() {
        System.out.println("2");
        System.out.println(doLab);
        System.out.println(doLab.getStage(currentStage));
        return doLab.getStage(currentStage).getStageAsJSON().toString();
    }


}
