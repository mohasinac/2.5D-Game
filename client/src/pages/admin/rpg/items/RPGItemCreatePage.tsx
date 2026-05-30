import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { itemFormConfig } from "./rpgItemConfig";

export default function RPGItemCreatePage() {
  return <RPGFormPage config={itemFormConfig} mode="create" />;
}
