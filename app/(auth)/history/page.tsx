import { Metadata } from "next";
import HistoryClient from "./HistoryClient";

export const metadata: Metadata = { title: "Mon historique" };

export default function HistoryPage() {
  return <HistoryClient />;
}