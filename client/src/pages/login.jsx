import { useNavigate } from "react-router-dom";
import { ScanQrCode } from "lucide-react";

const inputClass =
  "w-full rounded-full border-2 border-gray-300 px-4 py-2 text-sm italic placeholder:text-gray-400 focus:border-primary focus:outline-none";

// Placeholder logo. Ganti dengan <img> kalau logo sudah siap.
function LogoPlaceholder({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-primary-light text-center font-semibold text-primary ${className}`}
    >
      LOGO
      <br />
      Aryo Putra Farm
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: sambungkan ke backend (tahap autentikasi). Sementara langsung ke Beranda.
    navigate("/beranda");
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Kiri: logo (hanya desktop) */}
      <div className="hidden items-center justify-center bg-white lg:flex">
        <LogoPlaceholder className="h-48 w-3/5 max-w-md text-2xl" />
      </div>

      {/* Kanan: form login */}
      <div className="flex min-h-screen flex-col bg-primary lg:items-center lg:justify-center">
        <h1 className="py-10 text-center text-4xl font-bold text-white lg:pb-6 lg:pt-0">
          LOG IN
        </h1>

        <div className="relative flex flex-1 flex-col lg:w-full lg:max-w-sm lg:flex-none">
          {/* Lapisan hijau muda di belakang kartu */}
          <div className="absolute inset-x-0 -top-3 bottom-0 rounded-t-[40px] bg-primary-light lg:rounded-[40px]" />

          <form
            onSubmit={handleSubmit}
            className="relative flex flex-1 flex-col rounded-t-[40px] bg-white px-8 py-10 lg:min-h-[28rem] lg:rounded-[40px]"
          >
            <label
              htmlFor="username"
              className="mb-1 text-sm font-medium text-black"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username...."
              className={inputClass}
            />

            <label
              htmlFor="password"
              className="mb-1 mt-4 text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password..."
              className={inputClass}
            />

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-primary py-2 text-sm font-medium text-white hover:opacity-90"
            >
              LOG IN
            </button>

            <p className="my-2 text-center text-sm italic text-gray-500">
              atau
            </p>

            {/* Placeholder saja, fitur Scan QR belum dibuat */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-300 py-2 text-sm font-medium text-black hover:bg-gray-50"
            >
              <ScanQrCode size={24} />
              SCAN QR
            </button>

            {/* Logo di bawah form (hanya mobile) */}
            <LogoPlaceholder className="mx-auto mt-auto h-20 w-40 pt-0 text-xs lg:hidden" />
          </form>
        </div>
      </div>
    </div>
  );
}
