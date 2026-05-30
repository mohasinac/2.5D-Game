import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { arcFormConfig } from "./rpgArcConfig";

export default function RPGArcCreatePage() {
  return <RPGFormPage config={arcFormConfig} mode="create" />;
}
