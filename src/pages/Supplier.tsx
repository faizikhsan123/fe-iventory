// import CardComponent from "@/components/cardCompoentn";
import Navbar from "@/components/Navbar";
import SambutanCoomponent from "@/components/SambutanCoomponent";
import TableLayout from "@/components/TableSupplier";


const Supplier = () => {
  return (
    <div>

      <Navbar title="Supplier" />

      <SambutanCoomponent
        paragraf1="Master Supplier"
        paragraf2="Kelola daftar mitra supplier barang APD & Tools"
        button="+ Tambah Supplier"
      />

      {/* <CardComponent /> */}
      <TableLayout />

    </div>
  );
};

export default Supplier;
