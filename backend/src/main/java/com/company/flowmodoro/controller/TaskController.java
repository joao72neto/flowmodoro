package com.company.flowmodoro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.flowmodoro.model.Task;
import com.company.flowmodoro.service.TaskService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/tasks")
public class TaskController {

  @Autowired
  private TaskService taskService;

  public ResponseEntity<Void> save(@RequestBody Task task) {
    taskService.save(task);
    return ResponseEntity.ok().build();
  }
}
