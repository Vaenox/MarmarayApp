// types/station.ts

export class Station {
  name: string;
  id: number;
  visibleName: string;

  constructor(name: string, id: number, visibleName: string) {
    this.name = name;
    this.id = id;
    this.visibleName = visibleName;
  }

  // Tüm istasyonları buradan erişilebilir tut
  static readonly ALL: Station[] = [
    new Station("Halkalı",         1,  "Halkalı"),
    new Station("Mustafa Kemal",   2,  "Mustafa Kemal"),
    new Station("Küçükçekmece",    3,  "Küçükçekmece"),
    new Station("Florya",          4,  "Florya"),
    new Station("Florya Akvaryum", 5,  "Florya Akvaryum"),
    new Station("Yeşilköy",        6,  "Yeşilköy"),
    new Station("Yeşilyurt",       7,  "Yeşilyurt"),
    new Station("Ataköy",          8,  "Ataköy"),
    new Station("Bakırköy",        9,  "Bakırköy"),
    new Station("Yenimahalle",     10, "Yenimahalle"),
    new Station("Zeytinburnu",     11, "Zeytinburnu"),
    new Station("Kazlıçeşme",      12, "Kazlıçeşme"),
    new Station("Yenikapı",        13, "Yenikapı"),
    new Station("Sirkeci",         14, "Sirkeci"),
    new Station("Üsküdar",         15, "Üsküdar"),
    new Station("Ayrılık Çeşmesi", 16, "Ayrılık Çeşmesi"),
    new Station("Söğütlüçeşme",    17, "Söğütlüçeşme"),
    new Station("Feneryolu",       18, "Feneryolu"),
    new Station("Göztepe",         19, "Göztepe"),
    new Station("Erenköy",         20, "Erenköy"),
    new Station("Suadiye",         21, "Suadiye"),
    new Station("Bostancı",        22, "Bostancı"),
    new Station("Küçükyalı",       23, "Küçükyalı"),
    new Station("İdealtepe",       24, "İdealtepe"),
    new Station("Süreyya Plajı",   25, "Süreyya Plajı"),
    new Station("Maltepe",         26, "Maltepe"),
    new Station("Cevizli",         27, "Cevizli"),
    new Station("Atalar",          28, "Atalar"),
    new Station("Başak",           29, "Başak"),
    new Station("Kartal",          30, "Kartal"),
    new Station("Yunus",           31, "Yunus"),
    new Station("Pendik",          32, "Pendik"),
    new Station("Kaynarca",        33, "Kaynarca"),
    new Station("Tersane",         34, "Tersane"),
    new Station("Güzelyalı",       35, "Güzelyalı"),
    new Station("Aydıntepe",       36, "Aydıntepe"),
    new Station("İçmeler",         37, "İçmeler"),
    new Station("Tuzla",           38, "Tuzla"),
    new Station("Çayırova",        39, "Çayırova"),
    new Station("Fatih",           40, "Fatih"),
    new Station("Osmangazi",       41, "Osmangazi"),
    new Station("Darıca",          42, "Darıca"),
    new Station("Gebze",           43, "Gebze"),
  ];

  // ID ile bul
  static getById(id: number): Station | undefined {
    return Station.ALL.find((s) => s.id === id);
  }
  static getAll(): Station[] {
    return Station.ALL;
  }
  // İsim ile bul (büyük/küçük harf duyarsız)
  static getByName(name: string): Station | undefined {
    return Station.ALL.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
  }
}