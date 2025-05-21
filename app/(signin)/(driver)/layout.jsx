import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: {
    template: "EasyRides | DRIVER - %s ",
    default: "DRIVER",
  },
  description: "Driver dashboard",
};

export default function Layout({ children }) {
  return <ProtectedRoute requiredRole={["driver"]}>{children}</ProtectedRoute>;
}
