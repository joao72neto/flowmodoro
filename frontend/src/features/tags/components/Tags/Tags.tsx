import { GoPlus, GoSearch } from "react-icons/go";
import { PiCaretLeftBold } from "react-icons/pi";
import Input from "../../../../shared/components/Input";
import { useModalFactory } from "../../../../shared/hooks/useModalFactory";
import TagModal from "../TagModal";
import Tag from "./Tag";
import EmptyTags from "./EmptyTags";
import { useTags } from "../../hooks/useTags";
import ExpandableButton from "../../../../shared/components/buttons/ExpandableButton";
import clsx from "clsx";
import type { ProjectType } from "../../../projects/projects.types";

const Tags = ({
  project,
  onBack,
}: {
  project: ProjectType;
  onBack: () => void;
}) => {
  const { Modal: CreateTag, openModal: openTagModal } =
    useModalFactory(TagModal);

  const {
    tags,
    searchQuery,
    setSearchQuery,
    handleCreateTag,
    handleDeleteTag,
    handleEditTag,
  } = useTags(project.id);

  const isEmpty = tags.length === 0;

  return (
    <>
      <div className="relative flex flex-col gap-4 px-3 pb-4 w-full h-full min-h-0">
        <div className="relative flex items-center justify-center border-b border-border py-3 min-h-[65px]">
          <button
            onClick={onBack}
            className="absolute left-0 p-1 text-neutral-40 hover:text-neutral-10 hover:bg-neutral-80 rounded-md transition-all cursor-pointer"
            aria-label="Voltar para projetos"
          >
            <PiCaretLeftBold size={24} />
          </button>
          <h1 className="text-2xl text-neutral-20 truncate font-semibold px-8">
            {project.name}
          </h1>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <ExpandableButton
            icon={<GoPlus size={25} />}
            variant="secondary"
            className="absolute bottom-4 right-4 z-10 rounded-full!"
            onClick={openTagModal}
          >
            Nova Tag
          </ExpandableButton>
          <Input
            placeholder="Pesquisar tag"
            icon={<GoSearch size={20} />}
            variant="secondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
            tags.map((item) => (
              <Tag
                key={item.id}
                tagData={item}
                onDelete={() => handleDeleteTag(item.id)}
                onEdit={handleEditTag}
              />
            ))
          )}
        </div>
      </div>
      <CreateTag confirm={handleCreateTag} />
    </>
  );
};

export default Tags;
