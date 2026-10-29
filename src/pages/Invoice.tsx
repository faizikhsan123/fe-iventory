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
  const { isAdmin } = useAuth();
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
        title: "Delete invoice?",
        text: `Invoice "${inv.service_name}" (${inv.division}) and its status history will be deleted.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });
      if (!ok.isConfirmed) return;
      const err = await remove(inv.id);
      if (err) Swal.fire("Failed!", err, "error");
      else refresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh],
  );

  return (
    <div>
      <Navbar title="Invoice" />

      <SambutanComponent
        paragraf1="Invoice"
        button={isAdmin ? "+ Add Invoice" : undefined}
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
