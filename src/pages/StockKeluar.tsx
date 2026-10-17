import Navbar from "@/components/Navbar";
import StockKeluar from "@/components/StockKeluar/StockKeluar";
import { StockOutReadOnly } from "@/components/StockReadOnlyHistory";
import { useAuth } from "@/hooks/auth/useAuth";


const StockKeluarPage = () => {
  const { isAdmin } = useAuth();
  return (
    <div>
      <Navbar title="Barang Keluar" />

      {isAdmin ? <StockKeluar /> : <StockOutReadOnly />}

    </div>
  );
};

export default StockKeluarPage;
