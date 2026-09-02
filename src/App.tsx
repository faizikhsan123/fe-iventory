import { Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard";
import Items from "./pages/Items";
import Supplier from "./pages/Supplier";
import Employes from "./pages/Employes";


const App = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Dashboard></Dashboard>}>dahsb</Route>
          <Route path="/items" element={<Items></Items>}>items</Route>
          <Route path="/supplier" element={<Supplier></Supplier>}>supplier</Route>
          <Route path="/employes" element={<Employes></Employes>}>employes</Route>
        </Routes>
    </div>
  );
};

export default App;
