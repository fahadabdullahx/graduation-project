import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "EasyRides | %s ",
    default: "EasyRides",
  },
  description: "EasyRides - Share your journey",
  icons: "/logoIconW.svg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[60vh]`}
      >
        <Navbar />
        <main className="min-h-[50lvh]">{children}</main>

        <footer className="bg-gradient-to-r  border-t mt-5">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Link href="/" className="flex items-center space-x-2">
                  <img src="/logoTextB.svg" alt="logo" className="h-6" />
                </Link>
                <p className="mt-4 ">
                  Making travel more social, affordable, and sustainable.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/become-a-driver"
                      className=" hover:text-gray-200"
                    >
                      Become a Driver
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      Safety
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      Twitter
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      Facebook
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className=" hover:text-gray-200">
                      Instagram
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center ">
              <p>© 2025 EasyRide. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
