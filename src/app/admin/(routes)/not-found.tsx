import { Button } from "@/components/ui/button";
import { adminHeadersHeight, headersHeight } from "@/lib/utils";
import { ArrowLeft, Home, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div
      className="flex items-center justify-center bg-background"
      style={{ minHeight: `calc(100vh - ${adminHeadersHeight}px)` }}
    >
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Admin Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The admin page you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to access it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="default"
          >
            <Link href="/admin/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
          >
            <Link href="/admin/settings">
              <Settings className="w-4 h-4 mr-2" />
              Admin Settings
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Error Code: ADMIN_404</p>
        </div>
      </div>
    </div>
  );
}
