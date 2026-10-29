import CreateEmployes from "@/components/employes/CreateEmployes";
import TableEmployes from "@/components/employes/TableEmployes";
import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";

import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";

const Employes = () => {
  const { isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <Navbar title="Employees"></Navbar>

      <SambutanComponent
        paragraf1="Master Employees"
        paragraf2="Manage employee data"
        button={isAdmin ? "+ Add Employee" : undefined}
        onclick={isAdmin ? () => setIsDialogOpen(true) : undefined}
      />

      <CreateEmployes
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />

      <TableEmployes refreshKey={refreshKey} />
    </div>
  );
};

export default Employes;