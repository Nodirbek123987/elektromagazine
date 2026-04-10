import { Building2, Users, Award, TrendingUp } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  const { t } = useLang();

  const stats = [
    { icon: Building2, value: "2018", label: t("about.stat.since") },
    { icon: Users, value: "500+", label: t("about.stat.clients") },
    { icon: Award, value: "100%", label: t("about.stat.quality") },
    { icon: TrendingUp, value: "1000+", label: t("about.stat.products") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <div className="bg-section-alt border-b">
          <div className="container py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t("about.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("about.subtitle")}</p>
          </div>
        </div>

        <div className="container py-12 space-y-12">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className={`animate-fade-up stagger-${i + 1} flex flex-col items-center gap-2 rounded-xl border bg-background p-6 text-center`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-soft text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>

          {/* About text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{t("about.who.title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("about.who.text1")}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("about.who.text2")}</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{t("about.why.title")}</h2>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{t(`about.why.item${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
