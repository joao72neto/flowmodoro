import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectRepository;
import com.company.flowmodoro.features.projects.dtos.ProjectPayloadDTO;
import com.company.flowmodoro.features.projects.dtos.ProjectUpdateDTO;
import com.company.flowmodoro.features.projects.enums.ProjectErrorCode;
import com.company.flowmodoro.features.projects.exceptions.InvalidProjectException;
import java.util.UUID;

public class ProjectValidator {

    private final ProjectRepository projectRepository;

    public ProjectValidator(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public void validateUniqueName(String name, UUID userId) {
        if (projectRepository.existsByNameAndUserId(name, userId)) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_EXISTS,
                "Projeto com nome '" + name + "' já existe"
            );
        }
    }

    public void validateUniqueName(
        ProjectModel project,
        String name,
        UUID userId
    ) {
        if (project.getName().equals(name)) {
            return;
        }

        if (projectRepository.existsByNameAndUserId(name, userId)) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_EXISTS,
                "Projeto com nome '" + name + "' já existe"
            );
        }
    }
}
