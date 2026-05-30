import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { arcFormConfig } from "./rpgArcConfig";

export default function RPGArcEditPage() {
  return <RPGFormPage config={arcFormConfig} mode="edit" />;
}
