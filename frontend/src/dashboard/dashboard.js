import DashboardNavigation from "./navigation/navigation"

function Dashboard() {
    return (
        <div className="dashboardContainer">
            <div className="leftColumn">
                <DashboardNavigation />
            </div>
        </div>
    )
}

export default Dashboard