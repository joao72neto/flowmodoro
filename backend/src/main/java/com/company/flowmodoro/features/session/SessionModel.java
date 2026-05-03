package com.company.flowmodoro.features.session;

import java.time.LocalDate;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.company.flowmodoro.features.task.TaskModel;

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
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "sessions")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ses_id")
	private Long id;

	@Column(name = "ses_name")
	private String name;

	@Column(name = "ses_focus")
	private Long focus;

	@Column(name = "ses_ratio")
	private Double ratio;

	@Column(name = "ses_rest")
	private Long rest;

	@Column(name = "ses_user_id")
	private String userId;

	@Column(name = "ses_interruptions")
	private Integer interruptions;

	@Column(name = "ses_date", updatable = false)
	private LocalDate date;

	@Column(name = "ses_tsk_snapshot_id")
	private Long taskSnapshotId;

	@Column(name = "ses_tsk_snapshot_name")
	private String taskSnapshotName;

	@ManyToOne(optional = true)
	@JoinColumn(name = "ses_tsk_id", nullable = true)
	@OnDelete(action = OnDeleteAction.SET_NULL)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private TaskModel task;

}
