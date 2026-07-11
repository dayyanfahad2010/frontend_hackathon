export default function Footer() {
  return (
    <footer className="border-t border-line bg-white py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-light">
        <span>© {new Date().getFullYear()} MaintainIQ. All rights reserved.</span>
        <span>Scan. Report. Diagnose. Maintain.</span>
      </div>
    </footer>
  );
}
