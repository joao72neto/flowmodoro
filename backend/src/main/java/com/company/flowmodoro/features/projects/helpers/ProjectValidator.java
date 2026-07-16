import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectRepository;
import com.company.flowmodoro.features.projects.enums.ProjectErrorCode;
import com.company.flowmodoro.features.projects.exceptions.InvalidProjectException;
import java.util.UUID;

public class ProjectValidator {

    private final ProjectRepository projectRepository;

    public ProjectValidator(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public void existsByNameAndUserId(String name, UUID userId) {
        boolean exists = projectRepository.existsByNameAndUserId(name, userId);
        if (exists) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_EXISTS,
                "Projeto com nome '" + name + "' já existe"
            );
        }
    }
}
