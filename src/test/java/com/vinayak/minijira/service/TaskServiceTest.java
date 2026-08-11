package com.vinayak.minijira.service;

import com.vinayak.minijira.entity.Project;
import com.vinayak.minijira.entity.Task;
import com.vinayak.minijira.entity.User;
import com.vinayak.minijira.enums.TaskStatus;
import com.vinayak.minijira.repository.ProjectRepository;
import com.vinayak.minijira.repository.TaskRepository;
import com.vinayak.minijira.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void shouldThrowWhenAssigningToNonMember() {

        Project project = new Project();
        project.setId(1L);
        project.setMembers(new HashSet<>());

        User outsider = new User();
        outsider.setId(99L);

        Task task = new Task();
        task.setProject(project);

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        when(userRepository.findById(99L))
                .thenReturn(Optional.of(outsider));

        assertThrows(
                IllegalArgumentException.class,
                () -> taskService.assignTask(1L, 99L)
        );
    }

    @Test
    void shouldCreateTaskWithDefaultStatusTodo() {

        Project project = new Project();
        project.setId(1L);
        project.setMembers(new HashSet<>());

        Task task = new Task();
        task.setTitle("Fix login bug");

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(taskRepository.save(any(Task.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Task result = taskService.createTask(task, 1L, null);

        assertEquals(TaskStatus.TODO, result.getStatus());
        assertEquals(project, result.getProject());
    }

    @Test
    void shouldThrowWhenProjectNotFound() {

        when(projectRepository.findById(anyLong()))
                .thenReturn(Optional.empty());

        Task task = new Task();

        assertThrows(
                EntityNotFoundException.class,
                () -> taskService.createTask(task, 999L, null)
        );
    }
}