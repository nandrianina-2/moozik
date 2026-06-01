import { Header } from "@/components/layout/Header";
import { UploadForm } from "./UploadForm";

export default function UploadPage() {
  return (
    <div className="pb-32">
      <Header title="Ajouter un son" />
      <UploadForm />
    </div>
  );
}