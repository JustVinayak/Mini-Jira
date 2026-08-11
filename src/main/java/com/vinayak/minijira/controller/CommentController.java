package com.vinayak.minijira.controller;

import com.vinayak.minijira.entity.Comment;
import com.vinayak.minijira.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<Comment> create(
            @Valid @RequestBody Comment comment,
            @RequestParam Long taskId,
            @RequestParam Long authorId) {

        return ResponseEntity.ok(
                commentService.addComment(comment, taskId, authorId)
        );
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Comment>> getByTask(
            @PathVariable Long taskId) {

        return ResponseEntity.ok(
                commentService.getCommentsByTask(taskId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        commentService.deleteComment(id);

        return ResponseEntity.noContent().build();
    }
}