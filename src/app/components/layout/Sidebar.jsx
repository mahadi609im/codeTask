'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiHome, BiPlusCircle } from 'react-icons/bi';
import { BsCheckSquare } from 'react-icons/bs';
import {
  LuBookOpen,
  LuClipboardList,
  LuFileText,
  LuLayoutDashboard,
} from 'react-icons/lu';

export default function Sidebar({ role, drawerId = 'dashboard-drawer' }) {
  const pathname = usePathname();
  const isInstructor = role === 'instructor';

  const instructorLinks = [
    {
      label: 'Analytics & Overview',
      href: '/',
      icon: <LuLayoutDashboard className="size-5 shrink-0" />,
    },
    {
      label: 'Manage Assignments',
      href: '/assignments',
      icon: <LuClipboardList className="size-5 shrink-0" />,
    },
    {
      label: 'Create Assignment',
      href: '/assignments/new',
      icon: <BiPlusCircle className="size-5 shrink-0" />,
    },
  ];

  const studentLinks = [
    {
      label: 'My Learning Hub',
      href: '/',
      icon: <BiHome className="size-5 shrink-0" />,
    },
    {
      label: 'Available Assignments',
      href: '/assignments',
      icon: <LuBookOpen className="size-5 shrink-0" />,
    },
    {
      label: 'My Submissions',
      href: '/assignments/my-submissions',
      icon: <BsCheckSquare className="size-5 shrink-0" />,
    },
  ];
  const links = isInstructor ? instructorLinks : studentLinks;

  const closeMobileDrawer = () => {
    const drawerCheckbox = document.getElementById(drawerId);
    if (drawerCheckbox && window.innerWidth < 1024) {
      drawerCheckbox.checked = false;
    }
  };

  return (
    <aside className="w-64 min-h-full bg-base-200 border-r border-base-300 flex flex-col select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-base-300 flex items-center">
        <Link
          href="/"
          onClick={closeMobileDrawer}
          className="text-lg font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          CodeTask
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {links.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileDrawer}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white font-semibold'
                  : 'text-neutral-content/70 hover:bg-base-300 hover:text-white'
              }`}
            >
              <span
                className={isActive ? 'text-white' : 'text-neutral-content/60'}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
