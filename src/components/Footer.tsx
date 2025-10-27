const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-sm text-slate-500">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center lg:flex-row lg:px-8 lg:text-left">
        <p>&copy; {new Date().getFullYear()} PM0 Labs. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-300" href="#">
            Status
          </a>
          <a className="hover:text-slate-300" href="#">
            Security
          </a>
          <a className="hover:text-slate-300" href="#">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
