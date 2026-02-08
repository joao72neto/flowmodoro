package com.company.flowmodoro.task.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.flowmodoro.task.dtos.TaskDTO;
import com.company.flowmodoro.task.dtos.TaskStatusDTO;
import com.company.flowmodoro.task.dtos.TaskUpdateDTO;
import com.company.flowmodoro.task.mappers.TaskMapper;
import com.company.flowmodoro.task.mappers.TaskStatusMapper;
import com.company.flowmodoro.task.mappers.TaskUpdateMapper;
import com.company.flowmodoro.task.model.Task;
import com.company.flowmodoro.task.service.TaskService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/task")
public class TaskController {

  private final TaskService taskService;
  private final TaskMapper taskMapper;
  private final TaskStatusMapper taskStatusMapper;
  private final TaskUpdateMapper taskUpdateMapper;

  public TaskController(TaskService taskService, TaskMapper taskMapper, TaskStatusMapper taskStatusMapper,
      TaskUpdateMapper taskUpdateMapper) {
    this.taskService = taskService;
    this.taskMapper = taskMapper;
    this.taskStatusMapper = taskStatusMapper;
    this.taskUpdateMapper = taskUpdateMapper;
  }

  @GetMapping
  public ResponseEntity<List<TaskDTO>> consult() {
    return ResponseEntity.ok(taskMapper.toDTO(taskService.consult()));
  }

  @PostMapping
  public ResponseEntity<TaskDTO> save(@RequestBody TaskDTO task) {
    Task saved = taskService.save(taskMapper.toEntity(task));
    return ResponseEntity.status(201).body(taskMapper.toDTO(saved));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<TaskDTO> updateStatus(@PathVariable Long id, @RequestBody TaskStatusDTO task) {
    Task taskEntity = taskService.updateStatus(id, taskStatusMapper.toEntity(task));
    return ResponseEntity.ok(taskMapper.toDTO(taskEntity));
  }

  @PutMapping("/{id}")
  public ResponseEntity<TaskDTO> update(@PathVariable Long id, @RequestBody TaskUpdateDTO task) {
    Task taskEntity = taskService.update(id, taskUpdateMapper.toEntity(task));
    return ResponseEntity.ok(taskMapper.toDTO(taskEntity));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    taskService.deleteById(id);
    return ResponseEntity.noContent().build();
  }

}
