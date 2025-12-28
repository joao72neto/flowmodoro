package com.company.flowmodoro.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.flowmodoro.dto.TaskDTO;
import com.company.flowmodoro.mapper.TaskMapper;
import com.company.flowmodoro.model.Task;
import com.company.flowmodoro.service.TaskService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/task")
public class TaskController {

  private final TaskService taskService;
  private final TaskMapper mapper;

  public TaskController(TaskService taskService, TaskMapper mapper) {
    this.taskService = taskService;
    this.mapper = mapper;
  }

  @GetMapping
  public ResponseEntity<List<TaskDTO>> consult() {
    return ResponseEntity.ok(mapper.toDTO(taskService.consult()));
  }

  @PostMapping
  public ResponseEntity<TaskDTO> save(@RequestBody TaskDTO task) {
    Task saved = taskService.save(mapper.toEntity(task));
    return ResponseEntity.status(201).body(mapper.toDTO(saved));
  }

  @PutMapping("/{id}")
  public ResponseEntity<TaskDTO> update(@PathVariable Long id, @RequestBody TaskDTO task) {
    Task taskEntity = taskService.update(id, mapper.toEntity(task));
    return ResponseEntity.ok(mapper.toDTO(taskEntity));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    taskService.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
