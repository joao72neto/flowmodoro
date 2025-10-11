package com.company.flowmodoro.model;

import java.sql.Date;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sessions")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Session {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ses_task")
    private String task;    

    @Column(name = "ses_focus")
    private Double focus;

    @Column(name = "ses_ratio")
    private Double ratio;

    @Column(name = "ses_rest")
    private Double rest;

    @Column(name = "ses_interruptions")
    private Integer interruptions;

    @Column(name = "ses_date", updatable = false)
    @CreationTimestamp
    private Date date;
}
