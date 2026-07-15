import { Outlet, useLocation, matchPath } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// We use a plain <BrowserRouter>, not a data router (createBrowserRouter),
// so useMatches()/route "handle" data isn't available here. Deriving the
// title from the current pathname instead keeps things simple and avoids
// needing a data router just for a page heading.
const TITLES = [
  { pattern: "/app/dashboard", title: "Dashboard" },
  { pattern: "/app/assets", title: "Assets" },
  { pattern: "/app/assets/:id", title: "Asset details" },
  { pattern: "/app/issues", title: "Issues" },
  { pattern: "/app/my-issues", title: "My issues" },
  { pattern: "/app/issues/:id", title: "Issue details" },
];

function getTitle(pathname) {
  const match = TITLES.find(({ pattern }) => matchPath(pattern, pathname));
  return match?.title || "MaintainIQ";
}

export default function DashboardLayout() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
