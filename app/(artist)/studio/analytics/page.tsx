import { Header } from "@/components/layout/Header";
import { AnalyticsClient } from "./AnalyticsClient";

export default function AnalyticsPage() {
  return (
    <div className="pb-32">
      <Header title="Analytics" />
      <AnalyticsClient />
    </div>
  );
}