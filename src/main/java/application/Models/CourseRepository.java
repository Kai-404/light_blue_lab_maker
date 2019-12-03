package application.Models;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByProfessor(String professor);
    Course getById(String id);
    List<Course> findByTerm(String term);
    List<Course> findByTitle(String title);
    List<Course> findByTitleAndTerm(String title, String term);
}
