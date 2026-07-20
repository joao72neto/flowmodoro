import { db } from "../../local/indexedDB";
import type { TagModel } from "./local/tag.model";

class SyncTags {
  async syncTags() {
    await this.syncCreateTags();
  }

  async syncCreateTags() {
    const tags: TagModel[] = await db.tags
      .where("pending_action")
      .equals("CREATE")
      .toArray();

    if (tags.length === 0) return;

    // const payload: TagPayloadDTO[] = mapper.toPayloadList(tags);
    // await createTags(payload);

    await db.tags.bulkPut(tags.map((t) => ({ ...t, pending_action: null })));
  }
}

export default new SyncTags();
