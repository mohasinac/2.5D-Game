import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { regionFormConfig } from "./rpgRegionConfig";

export default function RPGRegionEditPage() {
  return <RPGFormPage config={regionFormConfig} mode="edit" />;
}
