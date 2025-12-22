package com.company.flowmodoro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
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

  @Autowired
  private TaskService taskService;

  @Autowired
  private TaskMapper mapper;

  @PostMapping
  public ResponseEntity<TaskDTO> save(@RequestBody TaskDTO task) {
    Task taskEntity = taskService.save(mapper.toEntity(task));
    taskService.save(taskEntity);
    return ResponseEntity.ok(mapper.toDTO(taskEntity));
  }
}
