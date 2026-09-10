import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  const user = {
    name: 'Alex Johnson',
    email: 'alex@programminghero.com',
    role: 'instructor',
  };

  return (
    <div className="drawer lg:drawer-open h-screen w-full overflow-hidden bg-base-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col h-screen w-full min-w-0 overflow-hidden">
        {/* Fixed Navbar */}
        <Navbar user={user} drawerId="dashboard-drawer" />

        {/* Scrollable Container (কন্টেন্ট বড় হলেও কাটবে না, স্মুথ স্ক্রোল হবে) */}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl w-full mx-auto pb-12">{children}</div>
        </main>
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side h-screen overflow-y-auto z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Sidebar role={user.role} drawerId="dashboard-drawer" />
      </div>
    </div>
  );
}
