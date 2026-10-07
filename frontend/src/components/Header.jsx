const Header = () => {
  return (
    <header className="border-b border-[#E4DDF5] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <h1 className="text-xl font-bold tracking-tight text-[#34215C]">
          Bulk Mail Sender
        </h1>

        <nav>
          <ul className="flex items-center gap-8">

            <li>
              <a
                href="/"
                className="text-sm font-medium text-[#756A8A] transition hover:text-[#6C4AB6]"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="/send-mail"
                className="text-sm font-medium text-[#756A8A] transition hover:text-[#6C4AB6]"
              >
                Send Mail
              </a>
            </li>

            <li>
              <a
                href="/history"
                className="text-sm font-medium text-[#756A8A] transition hover:text-[#6C4AB6]"
              >
                History
              </a>
            </li>

          </ul>
        </nav>

      </div>
    </header>
  );
};

export default Header;