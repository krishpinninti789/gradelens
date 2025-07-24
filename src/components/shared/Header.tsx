import { Brain, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-vprimary rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Grade<span className="text-vprimary">Lens</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-vprimary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/upload"
              className="text-gray-600 hover:text-vprimary transition-colors"
            >
              Upload Report
            </Link>
            <Link
              href="/demo"
              className="text-gray-600 hover:text-vprimary transition-colors"
            >
              Demo
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-vprimary hover:bg-vsecondary text-white">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
                userProfileMode="modal"
                afterSignOutUrl="/"
              />
            </SignedIn>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 pt-4 border-t">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="text-gray-600 hover:text-vprimary transition-colors py-2"
            >
              Home
            </Link>
            <Link
              href="/upload"
              className="text-gray-600 hover:text-vprimary transition-colors py-2"
            >
              Upload Report
            </Link>
            <Link
              href="/demo"
              className="text-gray-600 hover:text-vprimary transition-colors py-2"
            >
              Demo
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
