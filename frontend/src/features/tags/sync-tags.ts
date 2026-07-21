import { db } from "../../local/indexedDB";
import type { TagModel } from "./local/tag.model";
import { createTags, deleteTags } from "./api/tags.api";

import type { TagCreateDTO } from "./dtos/tags-request";

import mapper from "./tags.mappers";

class SyncTags {
  async syncTags() {
    await this.syncCreateTags();
    await this.syncDeleteTags();
  }

  async syncCreateTags() {
    const tags: TagModel[] = await db.tags
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (tags.length === 0) return;

    const payload: TagCreateDTO[] = mapper.toCreateDTOList(tags);
    await createTags(payload);

    await db.tags.bulkPut(tags.map((t) => ({ ...t, pending_action: null })));
  }

  async syncDeleteTags() {
    const tags: TagModel[] = await db.tags
      .where("pending_action")
      .equals("DELETE")
      .toArray();

    if (tags.length === 0) return;

    const ids = tags.map((t) => t.id);

    await deleteTags(ids);
    await db.tags.bulkDelete(ids);
  }
}

export default new SyncTags();
