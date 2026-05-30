import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { routeFormConfig } from "./rpgRouteConfig";

export default function RPGRouteEditPage() {
  return <RPGFormPage config={routeFormConfig} mode="edit" />;
}
