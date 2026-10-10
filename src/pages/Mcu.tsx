import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";
import TableMcu from "@/components/Mcu/TableMcu";
import McuFormDialog from "@/components/Mcu/McuFormDialog";
import { useAuth } from "@/hooks/auth/useAuth";
import { useMcuActions, type Mcu } from "@/hooks/Mcu/useMcu";

const McuPage = () => {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.roles?.includes("admin"));
  const { remove } = useMcuActions();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Mcu | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((m: Mcu) => {
    setEditing(m);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (m: Mcu) => {
      const ok = await Swal.fire({
        title: "Hapus data MCU?",
        text: `Data MCU ${m.employee_name} (${m.mcu_date}) akan dihapus beserta dokumennya.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      });
      if (!ok.isConfirmed) return;
      const err = await remove(m.id);
      if (err) Swal.fire("Gagal!", err, "error");
      else refresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh],
  );

  return (
    <div>
      <Navbar title="MCU" />

      <SambutanComponent
        paragraf1="Master MCU"
        paragraf2="Kelola data medical check up karyawan"
        button={isAdmin ? "+ Tambah MCU" : undefined}
        onclick={isAdmin ? openCreate : undefined}
      />

      <McuFormDialog open={formOpen} onOpenChange={setFormOpen} mcu={editing} onSuccess={refresh} />

      <TableMcu
        refreshKey={refreshKey}
        onEdit={isAdmin ? openEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
      />
    </div>
  );
};

export default McuPage;
