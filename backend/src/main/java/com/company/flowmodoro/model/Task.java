package com.company.flowmodoro.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tasks")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "tsk_id")
  private Long id;

  @Column(name = "tsk_name")
  private String name;

  @Column(name = "tsk_checked")
  private Boolean checked;

  @OneToOne
  @JoinColumn(name = "tsk_ses_id")
  private Session session;

}
