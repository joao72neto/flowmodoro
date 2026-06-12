package com.company.flowmodoro.features.tags;

import com.company.flowmodoro.features.projects.ProjectModel;

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
@Table(name = "tags")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TagModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tag_id")
	private Long id;

	@Column(name = "tag_name")
	private String name;

	@ManyToOne
	@JoinColumn(name = "tag_pro_id")
	private ProjectModel project;

}
