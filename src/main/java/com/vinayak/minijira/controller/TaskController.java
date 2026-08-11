package com.vinayak.minijira.controller;

import com.vinayak.minijira.entity.Task;
import com.vinayak.minijira.enums.TaskStatus;
import com.vinayak.minijira.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> create(
            @Valid @RequestBody Task task,
            @RequestParam Long projectId,
            @RequestParam(required = false) Long assigneeId) {

        return ResponseEntity.ok(
                taskService.createTask(task, projectId, assigneeId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getByProject(
            @PathVariable Long projectId) {

        return ResponseEntity.ok(
                taskService.getTasksByProject(projectId)
        );
    }

    @GetMapping("/assignee/{userId}")
    public ResponseEntity<List<Task>> getByAssignee(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                taskService.getTasksByAssignee(userId)
        );
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Task> assign(
            @PathVariable Long id,
            @RequestParam Long assigneeId) {

        return ResponseEntity.ok(
                taskService.assignTask(id, assigneeId)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status) {

        return ResponseEntity.ok(
                taskService.updateStatus(id, status)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        taskService.deleteTask(id);

        return ResponseEntity.noContent().build();
    }
}