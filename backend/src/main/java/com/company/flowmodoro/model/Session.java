package com.company.flowmodoro.model;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    @Column(name = "ses_id")
    private Long id;

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
    private LocalDate date;

    @ManyToOne()
    @JoinColumn(name = "ses_tsk_id")
    private Task task;
}
