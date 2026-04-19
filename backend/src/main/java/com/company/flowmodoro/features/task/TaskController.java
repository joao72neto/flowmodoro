package com.company.flowmodoro.features.task;

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

import com.company.flowmodoro.features.task.dtos.TaskDTO;
import com.company.flowmodoro.features.task.dtos.TaskStatusDTO;
import com.company.flowmodoro.features.task.dtos.TaskUpdateDTO;
import com.company.flowmodoro.features.task.mappers.TaskMapper;
import com.company.flowmodoro.features.task.mappers.TaskStatusMapper;
import com.company.flowmodoro.features.task.mappers.TaskUpdateMapper;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://flowmodoro-cp5v.vercel.app"
})
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
    TaskModel saved = taskService.save(taskMapper.toEntity(task));
    return ResponseEntity.status(201).body(taskMapper.toDTO(saved));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<TaskDTO> updateStatus(@PathVariable Long id, @RequestBody TaskStatusDTO task) {
    TaskModel taskEntity = taskService.updateStatus(id, taskStatusMapper.toEntity(task));
    return ResponseEntity.ok(taskMapper.toDTO(taskEntity));
  }

  @PutMapping("/{id}")
  public ResponseEntity<TaskDTO> update(@PathVariable Long id, @RequestBody TaskUpdateDTO task) {
    TaskModel taskEntity = taskService.update(id, taskUpdateMapper.toEntity(task));
    return ResponseEntity.ok(taskMapper.toDTO(taskEntity));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    taskService.deleteById(id);
    return ResponseEntity.noContent().build();
  }

}
