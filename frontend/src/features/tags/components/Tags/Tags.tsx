import { useMemo, useState } from "react";
import { GoPlus, GoSearch } from "react-icons/go";
import { PiCaretLeftBold } from "react-icons/pi";
import { RxUpdate } from "react-icons/rx";
import Input from "../../../../shared/components/inputs/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import TagModal from "../TagModal";
import Tag from "./Tag";
import EmptyTags from "./EmptyTags";
import ExpandableButton from "../../../../shared/components/buttons/ExpandableButton";
import clsx from "clsx";
import type { ProjectResponse } from "../../../projects/projects.types";
import type { TagResponse } from "../../tags.types";
import {
  useCreateTag,
  useDeleteTag,
  useUpdateTag,
  useFetchTagsByProject,
} from "../../hooks/useTags";
import TagsSkeleton from "./TagsSkeleton";

const Tags = ({
  project,
  onBack,
}: {
  project: ProjectResponse;
  onBack: () => void;
}) => {
  const { data: tags, isLoading } = useFetchTagsByProject(project.id);

  const [editingTag, setEditingTag] = useState<TagResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { Modal: CreateTag, openModal: openTagModal } =
    useModalFactory(TagModal);

  const { Modal: EditTag, openModal: openEditModal } =
    useModalFactory(TagModal);

  const { mutate: handleCreateTag } = useCreateTag();
  const { mutate: handleDeleteTag } = useDeleteTag();
  const { mutate: handleEditTag } = useUpdateTag();

  const filteredTags = useMemo(() => {
    if (!tags) return [];

    return tags
      .filter((tag) => tag.projectId === project.id)
      .filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [tags, project.id, searchQuery]);

  const isEmpty = filteredTags.length === 0;

  return (
    <>
      <div className="relative flex flex-col gap-4 px-3 pb-4 w-full h-full min-h-0">
        <div className="relative flex items-center gap-2 pt-4">
          <button
            onClick={onBack}
            className="p-1 text-neutral-40 hover:text-neutral-10 hover:-translate-x-1 transition-transform cursor-pointer"
            aria-label="Voltar para projetos"
          >
            <PiCaretLeftBold size={24} />
          </button>
          <h1 className="text-xl text-neutral-20 truncate font-semibold">
            {project.name}
          </h1>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Input
            placeholder="Pesquisar tag"
            icon={<GoSearch size={20} />}
            variant="secondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {isLoading ? (
          <TagsSkeleton />
        ) : (
          <div
            className={clsx(
              "flex-1 flex flex-col gap-2 overflow-auto contain-content scrollbar-hidden",
              isEmpty && "justify-center",
            )}
          >
            {isEmpty ? (
              <EmptyTags
                title={searchQuery ? "Nenhum resultado" : "Sem tags"}
                message={
                  searchQuery
                    ? `Não encontramos nada para "${searchQuery}".`
                    : "Crie sua primeira tag para começar a organizar seu tempo."
                }
              />
            ) : (
              filteredTags.map((item) => (
                <Tag
                  key={item.id}
                  tagData={item}
                  onDelete={() => handleDeleteTag(item.id)}
                  onEdit={() => {
                    setEditingTag(item);
                    openEditModal();
                  }}
                />
              ))
            )}
          </div>
        )}

        <ExpandableButton
          icon={<GoPlus size={25} />}
          variant="secondary"
          className="absolute bottom-4 right-4 z-10 rounded-full!"
          onClick={openTagModal}
        >
          Nova Tag
        </ExpandableButton>
      </div>
      <CreateTag projectId={project.id} save={handleCreateTag} />
      <EditTag
        title="Atualizar Tag"
        projectId={project.id}
        edit={handleEditTag}
        defaultValues={editingTag || undefined}
        inputLabel="Novo nome"
        confirmButtonIcon={<RxUpdate />}
        confirmButtonText="Atualizar"
      />
    </>
  );
};

export default Tags;
