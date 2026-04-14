import { Phone } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const TopBar = () => {
  const { t } = useLang();
  return (
    <div className="bg-topbar text-topbar-foreground">
      <div className="container flex items-center justify-between py-2 text-sm">
       <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
  <a href="tel:+998977494995" className="flex items-center gap-2 hover:text-primary transition-colors">
    <Phone className="h-3.5 w-3.5" />
    +998 97 749 49 95
  </a>

  <a href="tel:+998977009890" className="flex items-center gap-2 hover:text-primary transition-colors">
    <Phone className="h-3.5 w-3.5" />
    +998 97 700 98 90
  </a>

  <a href="tel:+998977677664" className="flex items-center gap-2 hover:text-primary transition-colors">
    <Phone className="h-3.5 w-3.5" />
    +998 97 767 76 64
  </a>

  <a href="tel:+998903212900" className="flex items-center gap-2 hover:text-primary transition-colors">
    <Phone className="h-3.5 w-3.5" />
    +998 90 321 29 00
  </a>
</div>
        <span className="hidden sm:block">{t("topbar.delivery")}</span>
      </div>
    </div>
  );
};

export default TopBar;
