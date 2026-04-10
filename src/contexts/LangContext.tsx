import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "ru" | "uz";

type Translations = Record<string, Record<Lang, string>>;

const translations: Translations = {
  // Navbar
  "nav.home": { ru: "Главная", uz: "Bosh sahifa" },
  "nav.catalog": { ru: "Каталог", uz: "Katalog" },
  "nav.about": { ru: "О нас", uz: "Biz haqimizda" },
  "nav.contacts": { ru: "Контакты", uz: "Kontaktlar" },
  "nav.cart": { ru: "Корзина", uz: "Savat" },
  "nav.search": { ru: "Поиск товаров...", uz: "Mahsulotlarni qidirish..." },

  // TopBar
  "topbar.delivery": { ru: "Доставка по всему Узбекистану", uz: "O'zbekiston bo'ylab yetkazib berish" },

  // Hero
  "hero.badge": { ru: "Надёжный поставщик электротоваров", uz: "Ishonchli elektr mahsulotlari yetkazib beruvchi" },
  "hero.title": { ru: "Всё для электро\u00ADмонтажа в одном месте", uz: "Elektr montaj uchun hamma narsa bir joyda" },
  "hero.desc": { ru: "Кабельные наконечники, инструменты, измерительные приборы и низковольтная продукция от проверенных брендов.", uz: "Kabel uchlari, asboblar, o'lchov asboblari va past kuchlanishli mahsulotlar ishonchli brendlardan." },
  "hero.catalog": { ru: "Перейти в каталог", uz: "Katalogga o'tish" },
  "hero.about": { ru: "О компании", uz: "Kompaniya haqida" },

  // Features
  "feat.delivery": { ru: "Быстрая доставка", uz: "Tezkor yetkazib berish" },
  "feat.delivery.desc": { ru: "По всему Узбекистану", uz: "O'zbekiston bo'ylab" },
  "feat.quality": { ru: "Гарантия качества", uz: "Sifat kafolati" },
  "feat.quality.desc": { ru: "Сертифицированная продукция", uz: "Sertifikatlangan mahsulotlar" },
  "feat.support": { ru: "Поддержка", uz: "Qo'llab-quvvatlash" },
  "feat.support.desc": { ru: "Консультация специалистов", uz: "Mutaxassislar maslahati" },
  "feat.products": { ru: "500+ товаров", uz: "500+ mahsulotlar" },
  "feat.products.desc": { ru: "Широкий ассортимент", uz: "Keng assortiment" },

  // Categories
  "cat.title": { ru: "Категории товаров", uz: "Mahsulot kategoriyalari" },
  "cat.all": { ru: "Все товары", uz: "Barcha mahsulotlar" },
  "cat.measuring": { ru: "Измерительные приборы UNI-T", uz: "O'lchov asboblari UNI-T" },
  "cat.insulated": { ru: "Изолированные наконечники", uz: "Izolyatsiyalangan uchliklar" },
  "cat.tools": { ru: "Инструменты", uz: "Asboblar" },
  "cat.cable": { ru: "Кабельные наконечники", uz: "Kabel uchlari" },
  "cat.terminals": { ru: "Клеммы и шины", uz: "Klemmalar va shinalar" },
  "cat.mounting": { ru: "Монтажные аксессуары", uz: "Montaj aksessuarlari" },
  "cat.lowvolt": { ru: "Низковольтная продукция", uz: "Past kuchlanishli mahsulotlar" },
  "cat.heatshrink": { ru: "Термоусадка и изоляция", uz: "Termoqisqarish va izolyatsiya" },

  // CTA
  "cta.title": { ru: "Нужна консультация?", uz: "Maslahat kerakmi?" },
  "cta.desc": { ru: "Наши специалисты помогут подобрать нужное оборудование и ответят на все вопросы.", uz: "Mutaxassislarimiz kerakli uskunani tanlashga yordam berishadi va barcha savollarga javob berishadi." },
  "cta.call": { ru: "Позвонить нам", uz: "Bizga qo'ng'iroq qiling" },
  "cta.contacts": { ru: "Контакты", uz: "Kontaktlar" },

  // Footer
  "footer.rights": { ru: "Все права защищены.", uz: "Barcha huquqlar himoyalangan." },

  // Catalog page
  "catalog.title": { ru: "Каталог товаров", uz: "Mahsulotlar katalogi" },
  "catalog.all": { ru: "Все категории", uz: "Barcha kategoriyalar" },
  "catalog.search": { ru: "Поиск по названию...", uz: "Nom bo'yicha qidirish..." },
  "catalog.notfound": { ru: "Товары не найдены", uz: "Mahsulotlar topilmadi" },
  "catalog.notfound.desc": { ru: "Попробуйте изменить параметры поиска", uz: "Qidiruv parametrlarini o'zgartirib ko'ring" },
  "catalog.variants": { ru: "вариантов", uz: "variant" },
  "catalog.items": { ru: "товаров", uz: "mahsulot" },
  "catalog.negotiable": { ru: "Договорная", uz: "Kelishiladi" },
  "catalog.order": { ru: "Заказать", uz: "Buyurtma" },
  "catalog.brands": { ru: "Бренды", uz: "Brendlar" },
  "catalog.allBrands": { ru: "Все бренды", uz: "Barcha brendlar" },
  "catalog.sort": { ru: "Сортировка", uz: "Saralash" },
  "catalog.sort.name": { ru: "По названию", uz: "Nomi bo'yicha" },
  "catalog.sort.nameDesc": { ru: "По названию (Я-А)", uz: "Nomi bo'yicha (Z-A)" },
  "catalog.sort.new": { ru: "Сначала новые", uz: "Avval yangilari" },
  "catalog.sort.variantsDesc": { ru: "Больше вариантов", uz: "Ko'proq variantlar" },
  "catalog.suggestions": { ru: "Подсказки", uz: "Tavsiyalar" },
  "catalog.clear": { ru: "Сбросить фильтры", uz: "Filtrlarni tozalash" },

  // Order modal
  "order.title": { ru: "Оформить заказ", uz: "Buyurtma berish" },
  "order.comment": { ru: "Комментарий (необязательно)", uz: "Izoh (ixtiyoriy)" },
  "order.address": { ru: "Адрес доставки (необязательно)", uz: "Yetkazib berish manzili (ixtiyoriy)" },
  "order.send": { ru: "Отправить заявку", uz: "Arizani yuborish" },
  "order.success": { ru: "Заявка отправлена!", uz: "Ariza yuborildi!" },
  "order.success.desc": { ru: "Мы свяжемся с вами в ближайшее время", uz: "Tez orada siz bilan bog'lanamiz" },
  "order.error": { ru: "Ошибка отправки. Попробуйте позже.", uz: "Yuborishda xato. Keyinroq urinib ko'ring." },

  // Product detail page
  "product.back": { ru: "Вернуться в каталог", uz: "Katalogga qaytish" },
  "product.brand": { ru: "Бренд", uz: "Brend" },
  "product.variants": { ru: "Варианты", uz: "Variantlar" },
  "product.selected": { ru: "Выбранный вариант", uz: "Tanlangan variant" },
  "product.call": { ru: "Позвонить", uz: "Qo'ng'iroq qilish" },
  "product.related": { ru: "Похожие товары", uz: "O'xshash mahsulotlar" },

  // Contacts page
  "contacts.title": { ru: "Контакты", uz: "Kontaktlar" },
  "contacts.subtitle": { ru: "Свяжитесь с нами любым удобным способом", uz: "Biz bilan qulay usulda bog'laning" },
  "contacts.phone": { ru: "Телефон", uz: "Telefon" },
  "contacts.address": { ru: "Адрес", uz: "Manzil" },
  "contacts.address.value": { ru: "г. Ташкент, ул. Уста Ширин 134а, Жамий", uz: "Toshkent sh., Usta Shirin ko'chasi 134a, Jamiy" },
  "contacts.hours": { ru: "Режим работы", uz: "Ish vaqti" },
  "contacts.hours.value": { ru: "Пн-Сб: 9:00 - 18:00", uz: "Du-Sha: 9:00 - 18:00" },
  "contacts.form.title": { ru: "Обратная связь", uz: "Qayta aloqa" },
  "contacts.form.name": { ru: "Ваше имя", uz: "Ismingiz" },
  "contacts.form.phone": { ru: "Телефон", uz: "Telefon" },
  "contacts.form.message": { ru: "Сообщение", uz: "Xabar" },
  "contacts.form.send": { ru: "Отправить", uz: "Yuborish" },
  "contacts.form.success": { ru: "Сообщение отправлено!", uz: "Xabar yuborildi!" },
  "contacts.map": { ru: "Мы на карте", uz: "Biz xaritada" },

  // About page
  "about.title": { ru: "О нас", uz: "Biz haqimizda" },
  "about.subtitle": { ru: "Узнайте больше о нашей компании", uz: "Kompaniyamiz haqida ko'proq bilib oling" },
  "about.stat.since": { ru: "На рынке с", uz: "Bozorda" },
  "about.stat.clients": { ru: "Довольных клиентов", uz: "Mamnun mijozlar" },
  "about.stat.quality": { ru: "Сертифицировано", uz: "Sertifikatlangan" },
  "about.stat.products": { ru: "Товаров в каталоге", uz: "Katalogdagi mahsulotlar" },
  "about.who.title": { ru: "Кто мы", uz: "Biz kimamiz" },
  "about.who.text1": { ru: "Elektro Market — надёжный поставщик электротехнической продукции в Узбекистане. Мы специализируемся на кабельных наконечниках, инструментах, измерительных приборах и низковольтной продукции от проверенных мировых брендов.", uz: "Elektro Market — O'zbekistonda elektrotexnika mahsulotlarining ishonchli yetkazib beruvchisi. Biz kabel uchlari, asboblar, o'lchov asboblari va past kuchlanishli mahsulotlarni dunyo brendlaridan yetkazib beramiz." },
  "about.who.text2": { ru: "Наша цель — обеспечить профессионалов и компании качественным оборудованием по доступным ценам с быстрой доставкой по всей стране.", uz: "Bizning maqsadimiz — mutaxassislar va kompaniyalarni sifatli uskunalar bilan ta'minlash, arzon narxlarda va butun mamlakat bo'ylab tezkor yetkazib berish." },
  "about.why.title": { ru: "Почему выбирают нас", uz: "Nega bizni tanlashadi" },
  "about.why.item1": { ru: "Широкий ассортимент сертифицированной продукции от ведущих брендов", uz: "Yetakchi brendlardan sertifikatlangan mahsulotlarning keng assortimenti" },
  "about.why.item2": { ru: "Быстрая доставка по всему Узбекистану", uz: "O'zbekiston bo'ylab tezkor yetkazib berish" },
  "about.why.item3": { ru: "Профессиональная консультация и техническая поддержка", uz: "Professional maslahat va texnik qo'llab-quvvatlash" },
  "about.why.item4": { ru: "Гибкие условия сотрудничества и индивидуальный подход", uz: "Moslashuvchan hamkorlik shartlari va individual yondashuv" },
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "ru",
  setLang: () => {},
  t: (key: string) => key,
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("ru");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
