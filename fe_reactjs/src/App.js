import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Home from './pages/customer/Home';
import Showing from './pages/customer/Showing';
import Coming from './pages/customer/Coming';
import DetailsMovie from './pages/customer/DetailsMovie';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAccount from './pages/admin/ManageAccount';
import ManageBranch from './pages/admin/ManageBranch';
import RolePermission from './pages/admin/RolePermission';
import BranchAdminDashboard from './pages/branchAdmin/BranchAdminDashboard';
import ManageTheater from './pages/branchAdmin/ManageTheater';
import ManageShowtime from './pages/branchAdmin/ManageShowtime';
import ManageFood from './pages/branchAdmin/ManageFood';
import SelectShowtime from './pages/customer/SelectShowtime';
import SelectSeat from './pages/customer/SelectSeat';
import Account from './pages/customer/Account';
import { useSelector } from 'react-redux';
import Checkout from './pages/customer/Checkout';
import { store } from './redux/store';
import SelectFood from './pages/customer/SelectFood';
import History from './pages/customer/History';
import ManageMovie from './pages/admin/ManageMovie';
import AddTheater from './pages/branchAdmin/AddTheater';
import DesignSeats from './pages/branchAdmin/DesignSeats';

function App() {
  const isBranchAdmin = store.getState().user.currentUser?.user;
  const isAdmin = store.getState().user.currentUser?.user;
  const user = store.getState().user.currentUser?.user;
  return (
    <Router>
      <Routes>
        <>
          <Route path="/" element={<Home />} />
          <Route path="/showing" element={<Showing />} />
          <Route path="/coming" element={<Coming />} />
          <Route path="/detailsMovie/:id" element={<DetailsMovie />} />
          <Route
            path="/account"
            element={user ? <Account /> : <Navigate to="/" replace />}
          />
          <Route path="/history/:AccountID" element={<History />} ></Route>
          <Route path="/selectFood/:BranchID" element={<SelectFood />} ></Route>
          <Route path="/selectShowtime/:MovieID" element={<SelectShowtime />} ></Route>
          <Route path="/selectSeat/:ShowtimeID" element={<SelectSeat />} ></Route>
          <Route path="/checkout" element={<Checkout />} ></Route>
        </>

        {
          isBranchAdmin?.AccountTypeID === 2 && (
            <>
              <Route path='/branch-ad-dashboard' element={<BranchAdminDashboard />}></Route>
              <Route path='/manageTheater' element={<ManageTheater />}></Route>
              <Route path='/addTheater' element={<AddTheater />}></Route>
              <Route path='/designSeats' element={<DesignSeats />}></Route>
              <Route path='/manageShowtime' element={<ManageShowtime />}></Route>
              <Route path='/manageFood' element={<ManageFood />}></Route>
            </>
          )
        }

        {
          isAdmin?.AccountTypeID === 3 && (
            <>
              <Route path='/ad-dashboard' element={<AdminDashboard />}></Route>
              <Route path='/manageAccount' element={<ManageAccount />}></Route>
              <Route path='/manageBranch' element={<ManageBranch />}></Route>
              <Route path='/manageMovie' element={<ManageMovie />}></Route>
              <Route path='/rolePermission' element={<RolePermission />}></Route>
            </>
          )
        }

      </Routes>
    </Router>
  );
}

export default App;