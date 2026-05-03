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

	@Column(name = "tsk_name")
	private String name;

	@Column(name = "tsk_checked")
	private Boolean checked;

	@Column(name = "tsk_user_id")
	private String userId;

	@OneToMany(mappedBy = "task")
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private List<SessionModel> sessions;

}
