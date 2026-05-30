import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { regionFormConfig } from "./rpgRegionConfig";

export default function RPGRegionCreatePage() {
  return <RPGFormPage config={regionFormConfig} mode="create" />;
}
