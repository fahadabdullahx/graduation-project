import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: {
    template: "EasyRides | ADMIN - %s ",
    default: "ADMIN",
  },
};

export default function Layout({ children }) {
  const sectionList = ["Users", "Drivers"];

  return (
    <ProtectedRoute requiredRole={["admin"]}>
      <div className="container mx-auto p-4 pt-0">
        <Card className="py-2 rounded-none z-10 relative">
          <CardContent className="flex flex-row gap-2 px-2 overflow-auto">
            {sectionList.map((section, i) => (
              <Link
                key={i}
                href="/admin/driver"
                hash={section}
                as={`/admin/${section.replace(" ", "-")}`.toLowerCase()}
                className={`*:hover:bg-primary/10 rounded-sm p-2 hover:bg-primary/10`}
              >
                {section}
              </Link>
            ))}
          </CardContent>
        </Card>
        {children}
      </div>
    </ProtectedRoute>
  );
}
