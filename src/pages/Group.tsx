
import TableGroups from "@/components/Group/tableGroup";
import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";



const GroupPages = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <Navbar title="Groups"></Navbar>

      <SambutanComponent
        paragraf1="Master Groups"
        paragraf2="Kelola Data group "
        button="+ Tambah Group"
        // onclick={() => setIsDialogOpen(true)}
      />

      {/* <CreateEmployes
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      /> */}

      <TableGroups />
    </div>
  );
};

export default GroupPages;