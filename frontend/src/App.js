import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import Dashboard from "./dashboard/dashboard";
import UserDashborad from "./dashboard/content/user/userDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Layout />}>

                </Route>
                <Route path='/dashboard'>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<UserDashborad />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App