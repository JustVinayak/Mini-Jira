package com.vinayak.minijira.service;

import com.vinayak.minijira.entity.Project;
import com.vinayak.minijira.entity.Task;
import com.vinayak.minijira.entity.User;
import com.vinayak.minijira.enums.TaskStatus;
import com.vinayak.minijira.repository.ProjectRepository;
import com.vinayak.minijira.repository.TaskRepository;
import com.vinayak.minijira.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Task createTask(Task task, Long projectId, Long assigneeId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        task.setProject(project);
        task.setStatus(TaskStatus.TODO);

        if (assigneeId != null) {
            assignTaskInternal(task, project, assigneeId);
        }

        return taskRepository.save(task);
    }

    public Task assignTask(Long taskId, Long assigneeId) {
        Task task = getTaskById(taskId);

        assignTaskInternal(task, task.getProject(), assigneeId);

        return taskRepository.save(task);
    }

    private void assignTaskInternal(Task task, Project project, Long assigneeId) {
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        boolean isMember = project.getMembers().stream()
                .anyMatch(member -> member.getId().equals(assigneeId));

        if (!isMember) {
            throw new IllegalArgumentException(
                    "Cannot assign task: user is not a member of this project"
            );
        }

        task.setAssignee(assignee);
    }

    public Task updateStatus(Long taskId, TaskStatus newStatus) {
        Task task = getTaskById(taskId);

        task.setStatus(newStatus);

        return taskRepository.save(task);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTasksByAssignee(Long userId) {
        return taskRepository.findByAssigneeId(userId);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Map<String, Object> getProjectSummary(Long projectId) {

        List<Task> tasks = taskRepository.findByProjectId(projectId);

        Map<String, Long> statusCounts = tasks.stream()
                .collect(Collectors.groupingBy(
                        task -> task.getStatus().name(),
                        Collectors.counting()
                ));

        long total = tasks.size();

        long done = statusCounts.getOrDefault(
                "DONE",
                0L
        );

        double percentComplete =
                total == 0
                        ? 0
                        : (done * 100.0) / total;

        Map<String, Object> summary = new HashMap<>();

        summary.put("totalTasks", total);
        summary.put("statusCounts", statusCounts);
        summary.put(
                "percentComplete",
                Math.round(percentComplete)
        );

        return summary;
    }
}