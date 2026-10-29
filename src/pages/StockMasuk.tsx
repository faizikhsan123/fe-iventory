
import Navbar from "@/components/Navbar";

import TambahStock from "@/components/StockMasuk/StockMasuk";
import { StockInReadOnly } from "@/components/StockReadOnlyHistory";
import { useAuth } from "@/hooks/auth/useAuth";



const StockMasuk = () => {
  const { isAdmin } = useAuth();

  return (
    <div>
      <Navbar title="Stock In"/>

      {isAdmin ? <TambahStock /> : <StockInReadOnly />}

      {/* <SambutanCoomponent
        paragraf1="Stock In"
        paragraf2="Manage incoming stock"
        button="+ Add item"
        onclick={() => navigate("/create-items")}
      /> */}

      {/* <CardComponent /> */}
      {/* <TableItems /> */}
    </div>
  );
};

export default StockMasuk;
