import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (

    <header className="bg-white shadow h-16 flex items-center justify-between px-8">

      <h2 className="font-bold text-2xl">

        Dashboard

      </h2>

      <div className="flex items-center gap-5">

        <div className="flex items-center bg-gray-100 rounded-full px-4">

          <Search size={18} />

          <input
            placeholder="Search..."
            className="bg-transparent outline-none p-2"
          />

        </div>

        <Bell />

        <img
          src="https://i.pravatar.cc/40"
          alt=""
          className="rounded-full"
        />

      </div>

    </header>

  );
}