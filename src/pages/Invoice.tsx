import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";
import TableInvoice from "@/components/Invoice/TableInvoice";
import InvoiceFormDialog from "@/components/Invoice/InvoiceFormDialog";
import InvoiceDetailDialog from "@/components/Invoice/InvoiceDetailDialog";
import { useAuth } from "@/hooks/auth/useAuth";
import { useInvoiceActions, type Invoice } from "@/hooks/Invoice/useInvoice";

const InvoicePage = () => {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.roles?.includes("admin"));
  const { remove } = useInvoiceActions();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((inv: Invoice) => {
    setEditing(inv);
    setFormOpen(true);
  }, []);

  const openDetail = useCallback((inv: Invoice) => setDetailId(inv.id), []);

  const handleDelete = useCallback(
    async (inv: Invoice) => {
      const ok = await Swal.fire({
        title: "Hapus invoice?",
        text: `Invoice "${inv.title}" (${inv.division}) beserta riwayat statusnya akan dihapus.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      });
      if (!ok.isConfirmed) return;
      const err = await remove(inv.id);
      if (err) Swal.fire("Gagal!", err, "error");
      else refresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh],
  );

  return (
    <div>
      <Navbar title="Invoicing" />

      <SambutanComponent
        paragraf1="Status Invoicing"
        paragraf2="Pantau invoice jasa PMR, ER, Gas, dan Dryer sudah sampai tahap mana"
        button={isAdmin ? "+ Tambah Invoice" : undefined}
        onclick={isAdmin ? openCreate : undefined}
      />

      <InvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} invoice={editing} onSuccess={refresh} />

      <InvoiceDetailDialog
        open={detailId !== null}
        onOpenChange={(o) => !o && setDetailId(null)}
        invoiceId={detailId}
        canEdit={isAdmin}
        onChanged={refresh}
      />

      <TableInvoice
        refreshKey={refreshKey}
        onDetail={openDetail}
        onEdit={isAdmin ? openEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
      />
    </div>
  );
};

export default InvoicePage;
