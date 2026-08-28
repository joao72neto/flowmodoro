package com.company.flowmodoro.features.tags;

import com.company.flowmodoro.features.projects.ProjectModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "tags")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TagModel {

    @Id
    @Column(name = "tag_id")
    private UUID id;

    @Column(name = "tag_name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "tag_pro_id")
    private ProjectModel project;

    @UpdateTimestamp
    @Column(name = "tag_updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "tag_deleted_at")
    private OffsetDateTime deletedAt;
}
