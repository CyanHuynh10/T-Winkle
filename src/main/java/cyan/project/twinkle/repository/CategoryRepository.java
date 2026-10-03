package cyan.project.twinkle.repository;

import cyan.project.twinkle.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
