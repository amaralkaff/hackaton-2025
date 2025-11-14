import { DashboardLayout } from "@/components/sidebar";
import DashboardContent from "@/components/dashboard";

export default function Home() {
  return (
    <DashboardLayout title="Dashboard">
      <DashboardContent />
    </DashboardLayout>
  );
}
