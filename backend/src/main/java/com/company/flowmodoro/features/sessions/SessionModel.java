package com.company.flowmodoro.features.sessions;

import java.time.LocalDate;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.tags.TagModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

	@Column(name = "ses_date", updatable = false)
	private LocalDate date;

	@ManyToOne
	@JoinColumn(name = "ses_pro_id", nullable = true)
	private ProjectModel project;

	@ManyToOne
	@JoinColumn(name = "ses_tag_id", nullable = true)
	private TagModel tag;

}
