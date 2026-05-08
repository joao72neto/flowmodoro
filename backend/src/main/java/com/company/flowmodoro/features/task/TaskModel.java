package com.company.flowmodoro.features.task;

import java.util.List;

import com.company.flowmodoro.features.session.SessionModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "tasks")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tsk_id")
	private Long id;

	@NotBlank(message = "Task name is required")
	@Column(name = "tsk_name", nullable = false)
	private String name;

	@NotNull(message = "Task checked is required")
	@Column(name = "tsk_checked", nullable = false)
	private Boolean checked;

	@Column(name = "tsk_user_id", nullable = false)
	private String userId;

	@OneToMany(mappedBy = "task")
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private List<SessionModel> sessions;

}
