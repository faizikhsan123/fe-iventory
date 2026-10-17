import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";

import type { Training } from "@/types/Training";
import TrainingFormDialog from "@/components/Trainings/TrainingFormDialog";
import DeleteTraining from "@/components/Trainings/DeleteTraining";
import TableTraining from "@/components/Trainings/tableTraining";

const TrainingPages = () => {
  const { isAdmin } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Training | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Training | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  const openCreate = () => {
    setEditTarget(null);
    setIsFormOpen(true);
  };

  const openEdit = (t: Training) => {
    setEditTarget(t);
    setIsFormOpen(true);
  };

  return (
    <div>
      <Navbar title="Training" />

      <SambutanComponent
        paragraf1="Master Training"
        paragraf2="Kelola Data training"
        button={isAdmin ? "+ Tambah Training" : undefined}
        onclick={isAdmin ? openCreate : undefined}
      />

      <TrainingFormDialog
        open={isFormOpen}
        training={editTarget}
        onOpenChange={setIsFormOpen}
        onSuccess={refresh}
      />

      <DeleteTraining
        open={deleteTarget !== null}
        training={deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onSuccess={refresh}
      />

      <TableTraining refreshKey={refreshKey} onEdit={isAdmin ? openEdit : undefined} onDelete={isAdmin ? (t) => setDeleteTarget(t) : undefined} />
    </div>
  );
};

export default TrainingPages;