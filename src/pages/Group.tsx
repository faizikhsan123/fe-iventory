import { useState } from "react";
import TableGroups from "@/components/Group/tableGroup";
import CreateGroups from "@/components/Group/CreateGroups";
import UpdateGroups from "@/components/Group/UpdateGroups";

import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";
import DeleteGroups from "@/components/Group/DelteGroups";

const GroupPages = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; group_name: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div>
      <Navbar title="Groups" />

      <SambutanComponent
        paragraf1="Master Groups"
        paragraf2="Kelola Data group"
        button="+ Tambah Group"
        onclick={() => setIsCreateOpen(true)}
      />

      <CreateGroups open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={refresh} />

      <UpdateGroups
        open={editId !== null}
        groupId={editId}
        onOpenChange={(o) => !o && setEditId(null)}
        onSuccess={refresh}
      />

      <DeleteGroups
        open={deleteTarget !== null}
        group={deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onSuccess={refresh}
      />

      <TableGroups
        refreshKey={refreshKey}
        onEdit={(id) => setEditId(id)}
        onDelete={(g) => setDeleteTarget(g)}
      />
    </div>
  );
};

export default GroupPages;