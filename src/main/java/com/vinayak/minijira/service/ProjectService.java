package com.vinayak.minijira.service;

import com.vinayak.minijira.entity.Project;
import com.vinayak.minijira.entity.User;
import com.vinayak.minijira.repository.ProjectRepository;
import com.vinayak.minijira.repository.UserRepository;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import com.vinayak.minijira.entity.Task;
import com.vinayak.minijira.entity.User;
import jakarta.persistence.EntityNotFoundException;
import com.vinayak.minijira.repository.TaskRepository;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository,
                          TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }


    public Project createProject(Project project, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        project.setOwner(owner);

        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    public Project addMember(Long projectId, Long userId) {

        Project project = getProjectById(projectId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        project.getMembers().add(user);

        return projectRepository.save(project);
    }

    public Project removeMember(Long projectId, Long userId) {

        Project project = getProjectById(projectId);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found"));

        List<Task> assignedTasks = taskRepository
                .findByProjectId(projectId)
                .stream()
                .filter(task ->
                        task.getAssignee() != null &&
                                task.getAssignee().getId().equals(userId))
                .toList();

        assignedTasks.forEach(task -> task.setAssignee(null));

        taskRepository.saveAll(assignedTasks);

        project.getMembers().remove(user);

        return projectRepository.save(project);
    }
}