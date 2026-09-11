package com.company.flowmodoro.features.projects;

import com.company.flowmodoro.features.tags.TagModel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "projects")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectModel {

    @Id
    @Column(name = "pro_id")
    private UUID id;

    @Column(name = "pro_name")
    private String name;

    @Column(name = "pro_color")
    private String color;

    @Column(name = "pro_user_id")
    private UUID userId;

    @OneToMany(
        mappedBy = "project",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<TagModel> tags;

    @UpdateTimestamp
    @Column(name = "pro_updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "pro_deleted_at")
    private OffsetDateTime deletedAt;
}
