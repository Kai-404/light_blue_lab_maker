package application.Models;

import application.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
    User findByEmail(String username);
    User findByEmailAndPassword(String email, String password);
    User findByUsernameAndPassword(String username, String password);
    User getById(String id);
}
