import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";
import TableRfq from "@/components/Rfq/TableRfq";
import RfqFormDialog from "@/components/Rfq/RfqFormDialog";
import RfqDetailDialog from "@/components/Rfq/RfqDetailDialog";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRfqActions, useRfqOptions, type Rfq } from "@/hooks/Rfq/useRfq";

const RfqPage = () => {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.roles?.includes("admin"));
  const { remove } = useRfqActions();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Rfq | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // options ikut di-refresh setelah simpan, supaya saran type/area/customer baru langsung muncul
  const options = useRfqOptions(refreshKey);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((rfq: Rfq) => {
    setEditing(rfq);
    setFormOpen(true);
  }, []);

  const openDetail = useCallback((rfq: Rfq) => setDetailId(rfq.id), []);

  const handleDelete = useCallback(
    async (rfq: Rfq) => {
      const ok = await Swal.fire({
        title: "Hapus RFQ?",
        text: `RFQ ${rfq.enquiry_no} (${rfq.customer}) beserta riwayat progresnya akan dihapus.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      });
      if (!ok.isConfirmed) return;
      const err = await remove(rfq.id);
      if (err) Swal.fire("Gagal!", err, "error");
      else refresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh],
  );

  return (
    <div>
      <Navbar title="RFQ" />

      <SambutanComponent
        paragraf1="Log RFQ"
        paragraf2="Pantau permintaan penawaran dari enquiry sampai PO, lengkap dengan prioritas dan PIC"
        button={isAdmin ? "+ Tambah RFQ" : undefined}
        onclick={isAdmin ? openCreate : undefined}
      />

      <RfqFormDialog open={formOpen} onOpenChange={setFormOpen} rfq={editing} options={options} onSuccess={refresh} />

      <RfqDetailDialog
        open={detailId !== null}
        onOpenChange={(o) => !o && setDetailId(null)}
        rfqId={detailId}
        options={options}
        canEdit={isAdmin}
        onChanged={refresh}
      />

      <TableRfq
        refreshKey={refreshKey}
        options={options}
        onDetail={openDetail}
        onEdit={isAdmin ? openEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
      />
    </div>
  );
};

export default RfqPage;
