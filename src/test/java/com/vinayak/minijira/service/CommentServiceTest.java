package com.vinayak.minijira.service;

import com.vinayak.minijira.entity.Comment;
import com.vinayak.minijira.entity.Task;
import com.vinayak.minijira.entity.User;
import com.vinayak.minijira.repository.CommentRepository;
import com.vinayak.minijira.repository.TaskRepository;
import com.vinayak.minijira.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    void shouldCreateCommentSuccessfully() {

        Task task = new Task();
        task.setId(1L);

        User author = new User();
        author.setId(2L);

        Comment comment = new Comment();
        comment.setContent("This task looks good.");

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        when(userRepository.findById(2L))
                .thenReturn(Optional.of(author));

        when(commentRepository.save(any(Comment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Comment result = commentService.addComment(comment, 1L, 2L);

        assertEquals(task, result.getTask());
        assertEquals(author, result.getAuthor());
        assertEquals("This task looks good.", result.getContent());
    }

    @Test
    void shouldThrowWhenTaskNotFound() {

        when(taskRepository.findById(999L))
                .thenReturn(Optional.empty());

        Comment comment = new Comment();
        comment.setContent("Test comment");

        assertThrows(
                EntityNotFoundException.class,
                () -> commentService.addComment(comment, 999L, 2L)
        );
    }

    @Test
    void shouldThrowWhenAuthorNotFound() {

        Task task = new Task();
        task.setId(1L);

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        when(userRepository.findById(999L))
                .thenReturn(Optional.empty());

        Comment comment = new Comment();
        comment.setContent("Test comment");

        assertThrows(
                EntityNotFoundException.class,
                () -> commentService.addComment(comment, 1L, 999L)
        );
    }
}