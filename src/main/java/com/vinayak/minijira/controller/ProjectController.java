package com.vinayak.minijira.controller;

import com.vinayak.minijira.entity.Project;
import com.vinayak.minijira.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> create(
            @RequestBody Project project,
            @RequestParam Long ownerId) {

        return ResponseEntity.ok(
                projectService.createProject(project, ownerId)
        );
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAll() {
        return ResponseEntity.ok(
                projectService.getAllProjects()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                projectService.getProjectById(id)
        );
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<Project> addMember(
            @PathVariable Long id,
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                projectService.addMember(id, userId)
        );
    }
}