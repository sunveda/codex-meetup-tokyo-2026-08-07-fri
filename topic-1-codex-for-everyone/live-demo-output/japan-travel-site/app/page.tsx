"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Place = {
  id: string;
  name: string;
  jp: string;
  region: string;
  season: "Spring" | "Summer" | "Autumn" | "Winter" | "All year";
  category: "Nature" | "Culture" | "City" | "Coast" | "Onsen";
  image: string;
};

const places: Place[] = [
  { id: "fuji", name: "Mount Fuji & Kawaguchiko", jp: "富士山・河口湖", region: "Yamanashi", season: "Spring", category: "Nature", image: "/places/fuji.webp" },
  { id: "kyoto", name: "Kyoto's Sacred Paths", jp: "京都", region: "Kansai", season: "Autumn", category: "Culture", image: "/places/kyoto.webp" },
  { id: "miyajima", name: "Miyajima Island", jp: "宮島", region: "Hiroshima", season: "Autumn", category: "Coast", image: "/places/miyajima.webp" },
  { id: "shirakawago", name: "Shirakawa-go", jp: "白川郷", region: "Gifu", season: "Winter", category: "Culture", image: "/places/shirakawago.webp" },
  { id: "tokyo", name: "Tokyo After Dark", jp: "東京", region: "Kanto", season: "All year", category: "City", image: "/places/tokyo.webp" },
  { id: "nara", name: "Nara Park", jp: "奈良公園", region: "Kansai", season: "Spring", category: "Culture", image: "/places/nara.webp" },
  { id: "koyasan", name: "Mount Koya", jp: "高野山", region: "Wakayama", season: "Autumn", category: "Culture", image: "/places/koyasan.webp" },
  { id: "kanazawa", name: "Kanazawa & Kenroku-en", jp: "金沢・兼六園", region: "Hokuriku", season: "Winter", category: "Culture", image: "/places/kanazawa.webp" },
  { id: "nikko", name: "Nikko", jp: "日光", region: "Tochigi", season: "Autumn", category: "Culture", image: "/places/nikko.webp" },
  { id: "takachiho", name: "Takachiho Gorge", jp: "高千穂峡", region: "Miyazaki", season: "Summer", category: "Nature", image: "/places/takachiho.webp" },
  { id: "yakushima", name: "Yakushima", jp: "屋久島", region: "Kagoshima", season: "Spring", category: "Nature", image: "/places/yakushima.webp" },
  { id: "kerama", name: "Kerama Islands", jp: "慶良間諸島", region: "Okinawa", season: "Summer", category: "Coast", image: "/places/kerama.webp" },
  { id: "shimanami", name: "Shimanami Kaido", jp: "しまなみ海道", region: "Setouchi", season: "Spring", category: "Coast", image: "/places/shimanami.webp" },
  { id: "kamikochi", name: "Kamikochi", jp: "上高地", region: "Nagano", season: "Summer", category: "Nature", image: "/places/kamikochi.webp" },
  { id: "himeji", name: "Himeji Castle", jp: "姫路城", region: "Hyogo", season: "Spring", category: "Culture", image: "/places/himeji.webp" },
  { id: "naoshima", name: "Naoshima Art Island", jp: "直島", region: "Setouchi", season: "Spring", category: "Coast", image: "/places/naoshima.webp" },
  { id: "biei", name: "Biei", jp: "美瑛", region: "Hokkaido", season: "Summer", category: "Nature", image: "/places/biei.webp" },
  { id: "ouchijuku", name: "Ouchi-juku", jp: "大内宿", region: "Fukushima", season: "Winter", category: "Culture", image: "/places/ouchijuku.webp" },
  { id: "matsushima", name: "Matsushima Bay", jp: "松島", region: "Miyagi", season: "All year", category: "Coast", image: "/places/matsushima.webp" },
  { id: "beppu", name: "Beppu Onsen", jp: "別府温泉", region: "Oita", season: "Winter", category: "Onsen", image: "/places/beppu.webp" },
];

const translations = {
  en: ["English", "Japan, beautifully personal.", "Twenty remarkable places, shaped into one journey by a local Japan travel specialist who understands European travellers.", "Explore the 20", "Plan my Japan", "20 places worth crossing the world for", "Search a place or region", "All", "Best time", "Let’s design your Japan", "Tell me how you like to travel. I’ll turn it into a thoughtful, realistic itinerary.", "Send my trip idea"],
  fr: ["Français", "Le Japon, rien que pour vous.", "Vingt lieux remarquables réunis en un voyage par un spécialiste local qui comprend les voyageurs européens.", "Découvrir les 20", "Planifier mon Japon", "20 lieux qui valent le voyage", "Rechercher un lieu ou une région", "Tous", "Meilleure période", "Créons votre Japon", "Dites-moi comment vous aimez voyager. Je le transformerai en itinéraire réaliste et soigné.", "Envoyer mon idée"],
  de: ["Deutsch", "Japan, ganz persönlich.", "Zwanzig außergewöhnliche Orte, verbunden zu einer Reise von einem lokalen Japan-Spezialisten für europäische Gäste.", "Alle 20 entdecken", "Meine Japanreise planen", "20 Orte, für die sich die Reise lohnt", "Ort oder Region suchen", "Alle", "Beste Reisezeit", "Gestalten wir Ihr Japan", "Erzählen Sie mir, wie Sie reisen möchten. Ich mache daraus eine durchdachte, realistische Route.", "Reiseidee senden"],
  es: ["Español", "Japón, de forma personal.", "Veinte lugares extraordinarios unidos en un viaje por un especialista local que entiende al viajero europeo.", "Descubrir los 20", "Planear mi Japón", "20 lugares por los que merece la pena viajar", "Buscar lugar o región", "Todos", "Mejor época", "Diseñemos tu Japón", "Cuéntame cómo te gusta viajar. Lo convertiré en un itinerario cuidado y realista.", "Enviar mi idea"],
  it: ["Italiano", "Il Giappone, su misura per te.", "Venti luoghi straordinari in un unico viaggio creato da uno specialista locale che conosce i viaggiatori europei.", "Scopri i 20", "Pianifica il mio Giappone", "20 luoghi per cui vale il viaggio", "Cerca luogo o regione", "Tutti", "Periodo migliore", "Disegniamo il tuo Giappone", "Raccontami come ami viaggiare. Lo trasformerò in un itinerario attento e realistico.", "Invia la mia idea"],
  pt: ["Português", "Japão, feito para si.", "Vinte lugares extraordinários reunidos numa viagem por um especialista local que conhece o viajante europeu.", "Descobrir os 20", "Planear o meu Japão", "20 lugares que valem a viagem", "Pesquisar lugar ou região", "Todos", "Melhor época", "Vamos criar o seu Japão", "Conte-me como gosta de viajar. Transformarei a ideia num roteiro cuidado e realista.", "Enviar a minha ideia"],
  nl: ["Nederlands", "Japan, helemaal persoonlijk.", "Twintig bijzondere plekken in één reis, samengesteld door een lokale Japan-specialist die Europese reizigers begrijpt.", "Ontdek alle 20", "Plan mijn Japan", "20 plekken die de reis waard zijn", "Zoek plaats of regio", "Alle", "Beste reistijd", "Laten we jouw Japan ontwerpen", "Vertel hoe je graag reist. Ik maak er een doordachte, realistische route van.", "Mijn reisidee versturen"],
  pl: ["Polski", "Japonia, naprawdę osobista.", "Dwadzieścia niezwykłych miejsc połączonych w jedną podróż przez lokalnego specjalistę rozumiejącego europejskich gości.", "Odkryj wszystkie 20", "Zaplanuj moją Japonię", "20 miejsc wartych podróży", "Szukaj miejsca lub regionu", "Wszystkie", "Najlepszy czas", "Zaprojektujmy Twoją Japonię", "Powiedz, jak lubisz podróżować. Zamienię to w przemyślany i realny plan.", "Wyślij pomysł"],
  cs: ["Čeština", "Japonsko, osobně pro vás.", "Dvacet výjimečných míst v jedné cestě od místního specialisty, který rozumí evropským cestovatelům.", "Objevit všech 20", "Naplánovat mé Japonsko", "20 míst, kvůli nimž stojí za to cestovat", "Hledat místo nebo region", "Vše", "Nejlepší období", "Navrhněme vaše Japonsko", "Řekněte mi, jak rádi cestujete. Připravím promyšlený a realistický itinerář.", "Odeslat nápad"],
  sk: ["Slovenčina", "Japonsko, osobne pre vás.", "Dvadsať výnimočných miest v jednej ceste od miestneho špecialistu, ktorý rozumie európskym cestovateľom.", "Objaviť všetkých 20", "Naplánovať moje Japonsko", "20 miest, pre ktoré sa oplatí cestovať", "Hľadať miesto alebo región", "Všetky", "Najlepší čas", "Navrhnime vaše Japonsko", "Povedzte mi, ako radi cestujete. Pripravím premyslený a realistický itinerár.", "Odoslať nápad"],
  hu: ["Magyar", "Japán, személyesen Önnek.", "Húsz különleges hely egy utazásban, egy helyi Japán-szakértőtől, aki érti az európai utazókat.", "Mind a 20 felfedezése", "Japán-utam tervezése", "20 hely, amiért érdemes útra kelni", "Hely vagy régió keresése", "Mind", "Legjobb időszak", "Tervezzük meg az Ön Japánját", "Mondja el, hogyan szeret utazni. Átgondolt, reális útitervet készítek.", "Utazási ötlet küldése"],
  ro: ["Română", "Japonia, creată personal.", "Douăzeci de locuri extraordinare într-o singură călătorie, create de un specialist local care înțelege turiștii europeni.", "Descoperă toate 20", "Planifică Japonia mea", "20 de locuri pentru care merită să călătorești", "Caută loc sau regiune", "Toate", "Perioada ideală", "Să proiectăm Japonia ta", "Spune-mi cum îți place să călătorești. Voi crea un itinerar atent și realist.", "Trimite ideea"],
  bg: ["Български", "Япония, лично за вас.", "Двадесет забележителни места в едно пътуване от местен специалист, който разбира европейските туристи.", "Разгледайте всички 20", "Планирайте моята Япония", "20 места, заради които си струва пътуването", "Търсене на място или регион", "Всички", "Най-добро време", "Нека създадем вашата Япония", "Разкажете ми как обичате да пътувате. Ще създам внимателен и реалистичен маршрут.", "Изпратете идеята"],
  el: ["Ελληνικά", "Η Ιαπωνία, προσωπικά για εσάς.", "Είκοσι ξεχωριστά μέρη σε ένα ταξίδι από έναν τοπικό ειδικό που κατανοεί τους Ευρωπαίους ταξιδιώτες.", "Ανακαλύψτε και τα 20", "Σχεδιάστε την Ιαπωνία μου", "20 μέρη που αξίζουν το ταξίδι", "Αναζήτηση τόπου ή περιοχής", "Όλα", "Καλύτερη εποχή", "Ας σχεδιάσουμε τη δική σας Ιαπωνία", "Πείτε μου πώς αγαπάτε να ταξιδεύετε. Θα δημιουργήσω ένα προσεγμένο, ρεαλιστικό πρόγραμμα.", "Αποστολή ιδέας"],
  sv: ["Svenska", "Japan, personligt för dig.", "Tjugo enastående platser i en resa, skapad av en lokal specialist som förstår europeiska resenärer.", "Upptäck alla 20", "Planera mitt Japan", "20 platser värda resan", "Sök plats eller region", "Alla", "Bästa tid", "Låt oss skapa ditt Japan", "Berätta hur du vill resa. Jag gör det till en genomtänkt och realistisk resplan.", "Skicka min idé"],
  da: ["Dansk", "Japan, personligt til dig.", "Tyve enestående steder samlet i én rejse af en lokal specialist, der forstår europæiske rejsende.", "Oplev alle 20", "Planlæg mit Japan", "20 steder rejsen værd", "Søg sted eller region", "Alle", "Bedste tidspunkt", "Lad os designe dit Japan", "Fortæl mig, hvordan du vil rejse. Jeg skaber en gennemtænkt og realistisk rejseplan.", "Send min idé"],
  fi: ["Suomi", "Japani, juuri sinulle.", "Kaksikymmentä upeaa paikkaa yhtenä matkana paikalliselta asiantuntijalta, joka ymmärtää eurooppalaisia matkailijoita.", "Tutustu kaikkiin 20", "Suunnittele Japanini", "20 paikkaa, joiden vuoksi kannattaa matkustaa", "Hae paikkaa tai aluetta", "Kaikki", "Paras aika", "Suunnitellaan sinun Japanisi", "Kerro, miten haluat matkustaa. Teen siitä harkitun ja realistisen reitin.", "Lähetä matkaidea"],
  et: ["Eesti", "Jaapan, just teile.", "Kakskümmend erakordset paika ühel reisil kohalikult spetsialistilt, kes mõistab Euroopa reisijaid.", "Avasta kõik 20", "Planeeri minu Jaapan", "20 kohta, mille pärast tasub reisida", "Otsi kohta või piirkonda", "Kõik", "Parim aeg", "Loome teie Jaapani", "Rääkige, kuidas teile meeldib reisida. Loon läbimõeldud ja realistliku marsruudi.", "Saada reisiidee"],
  lv: ["Latviešu", "Japāna, personīgi jums.", "Divdesmit izcilas vietas vienā ceļojumā no vietējā speciālista, kurš izprot Eiropas ceļotājus.", "Atklāt visas 20", "Plānot manu Japānu", "20 vietas, kuru dēļ vērts ceļot", "Meklēt vietu vai reģionu", "Visas", "Labākais laiks", "Izveidosim jūsu Japānu", "Pastāstiet, kā jums patīk ceļot. Izveidošu pārdomātu un reālistisku maršrutu.", "Nosūtīt ideju"],
  lt: ["Lietuvių", "Japonija, asmeniškai jums.", "Dvidešimt išskirtinių vietų vienoje kelionėje, kurią kuria vietinis specialistas, suprantantis Europos keliautojus.", "Atrasti visas 20", "Planuoti mano Japoniją", "20 vietų, dėl kurių verta keliauti", "Ieškoti vietos ar regiono", "Visos", "Geriausias laikas", "Sukurkime jūsų Japoniją", "Papasakokite, kaip mėgstate keliauti. Sukursiu apgalvotą ir realų maršrutą.", "Siųsti idėją"],
  sl: ["Slovenščina", "Japonska, osebno za vas.", "Dvajset izjemnih krajev v enem potovanju lokalnega strokovnjaka, ki razume evropske popotnike.", "Odkrijte vseh 20", "Načrtujte mojo Japonsko", "20 krajev, vrednih potovanja", "Išči kraj ali regijo", "Vsi", "Najboljši čas", "Oblikujmo vašo Japonsko", "Povejte mi, kako radi potujete. Ustvaril bom premišljen in realističen načrt.", "Pošlji idejo"],
  hr: ["Hrvatski", "Japan, osobno za vas.", "Dvadeset iznimnih mjesta u jednom putovanju lokalnog stručnjaka koji razumije europske putnike.", "Otkrijte svih 20", "Planirajte moj Japan", "20 mjesta vrijednih putovanja", "Traži mjesto ili regiju", "Svi", "Najbolje vrijeme", "Osmislimo vaš Japan", "Recite mi kako volite putovati. Izradit ću promišljen i realističan plan.", "Pošalji ideju"],
  ga: ["Gaeilge", "An tSeapáin, go pearsanta duitse.", "Fiche áit iontacha in aon turas amháin ó speisialtóir áitiúil a thuigeann taistealaithe Eorpacha.", "Faigh amach na 20", "Pleanáil mo Sheapáin", "20 áit ar fiú an turas", "Cuardaigh áit nó réigiún", "Gach", "Am is fearr", "Dearaimis do Sheapáin", "Inis dom conas is maith leat taisteal. Cruthóidh mé clár cúramach réalaíoch.", "Seol mo smaoineamh"],
  mt: ["Malti", "Il-Ġappun, personali għalik.", "Għoxrin post straordinarju fi vjaġġ wieħed minn speċjalista lokali li jifhem lill-vjaġġaturi Ewropej.", "Skopri l-20", "Ippjana l-Ġappun tiegħi", "20 post li jiswew il-vjaġġ", "Fittex post jew reġjun", "Kollha", "L-aħjar żmien", "Niddisinjaw il-Ġappun tiegħek", "Għidli kif tħobb tivvjaġġa. Noħloq itinerarju maħsub u realistiku.", "Ibgħat l-idea"],
  no: ["Norsk", "Japan, personlig for deg.", "Tjue enestående steder samlet i én reise av en lokal spesialist som forstår europeiske reisende.", "Oppdag alle 20", "Planlegg mitt Japan", "20 steder verdt reisen", "Søk sted eller region", "Alle", "Beste tid", "La oss designe ditt Japan", "Fortell hvordan du vil reise. Jeg lager en gjennomtenkt og realistisk reiserute.", "Send reiseideen"],
  uk: ["Українська", "Японія, особисто для вас.", "Двадцять неймовірних місць в одній подорожі від місцевого фахівця, який розуміє європейських мандрівників.", "Відкрити всі 20", "Спланувати мою Японію", "20 місць, заради яких варто подорожувати", "Пошук місця або регіону", "Усі", "Найкращий час", "Створімо вашу Японію", "Розкажіть, як ви любите подорожувати. Я створю продуманий і реалістичний маршрут.", "Надіслати ідею"],
  tr: ["Türkçe", "Japonya, size özel.", "Avrupalı gezginleri anlayan yerel bir uzmanın hazırladığı tek yolculukta yirmi olağanüstü yer.", "20 yeri keşfet", "Japonya'mı planla", "Yolculuğa değer 20 yer", "Yer veya bölge ara", "Tümü", "En iyi zaman", "Japonya'nızı tasarlayalım", "Nasıl seyahat etmeyi sevdiğinizi anlatın. Düşünceli ve gerçekçi bir rota hazırlayayım.", "Gezi fikrimi gönder"],
} as const;

type Language = keyof typeof translations;
const categories = ["All", "Nature", "Culture", "City", "Coast", "Onsen"] as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [sent, setSent] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const preferred = navigator.language.split("-")[0] as Language;
    if (preferred in translations) setLanguage(preferred);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const filteredPlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((place) =>
      (category === "All" || place.category === category) &&
      (!q || `${place.name} ${place.jp} ${place.region}`.toLowerCase().includes(q)),
    );
  }, [category, query]);

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kokoro Japan home">
          <span className="brand-mark">心</span>
          <span>KOKORO <b>JAPAN</b></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#places">{t[5]}</a>
          <a href="#styles">Travel styles</a>
          <a href="#about">Local care</a>
        </nav>
        <div className="header-actions">
          <label className="language-picker">
            <span className="sr-only">Language</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Choose language">
              {Object.entries(translations).map(([code, copy]) => <option key={code} value={code}>{copy[0]}</option>)}
            </select>
          </label>
          <a className="button button-small" href="#plan">{t[4]}</a>
        </div>
      </header>

      <section className="hero" id="top">
        <img className="hero-image" src="/places/fuji.webp" alt="Mount Fuji above Lake Kawaguchi in spring" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">PRIVATE JAPAN JOURNEYS · 日本の旅</p>
          <h1>{t[1]}</h1>
          <p className="hero-copy">{t[2]}</p>
          <div className="hero-buttons">
            <a className="button" href="#places">{t[3]} <span>↓</span></a>
            <a className="text-link" href="#plan">{t[4]} <span>↗</span></a>
          </div>
        </div>
        <div className="hero-stats" aria-label="Service highlights">
          <div><strong>20</strong><span>beautiful places</span></div>
          <div><strong>27</strong><span>European languages</span></div>
          <div><strong>1:1</strong><span>local trip design</span></div>
        </div>
        <div className="scroll-cue">SCROLL TO DISCOVER <span>↓</span></div>
      </section>

      <section className="places-section" id="places">
        <div className="section-intro">
          <div>
            <p className="eyebrow dark">THE KOKORO 20</p>
            <h2>{t[5]}</h2>
          </div>
          <p>From snow villages to subtropical islands—use these places as inspiration, then let us connect them into a journey that feels effortless.</p>
        </div>

        <div className="discovery-bar">
          <label className="search-box">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t[6]} aria-label={t[6]} />
          </label>
          <div className="filters" aria-label="Filter destinations">
            {categories.map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item === "All" ? t[7] : item}</button>
            ))}
          </div>
          <span className="result-count">{String(filteredPlaces.length).padStart(2, "0")} / 20</span>
        </div>

        <div className="place-grid">
          {filteredPlaces.map((place, index) => (
            <article className={`place-card ${index === 0 ? "place-card-featured" : ""}`} key={place.id}>
              <img src={place.image} alt={`${place.name}, ${place.region}, Japan`} loading={index > 3 ? "lazy" : "eager"} />
              <div className="place-overlay" />
              <div className="place-number">{String(places.indexOf(place) + 1).padStart(2, "0")}</div>
              <div className="place-meta"><span>{place.category}</span><span>{place.region}</span></div>
              <div className="place-title">
                <p>{place.jp}</p>
                <h3>{place.name}</h3>
                <span>{t[8]} · {place.season}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="styles-section" id="styles">
        <div className="section-intro compact">
          <div><p className="eyebrow">TRAVEL YOUR WAY</p><h2>Not a package.<br />Your kind of Japan.</h2></div>
          <p>We balance icons with quiet discoveries, comfortable pacing and the small details that make Japan feel welcoming.</p>
        </div>
        <div className="style-grid">
          <article><span>01</span><h3>First Japan</h3><p>Tokyo, Fuji, Kyoto and beyond—with every transition made simple.</p></article>
          <article><span>02</span><h3>Slow & Soulful</h3><p>Ryokan stays, crafts, gardens, countryside and time to breathe.</p></article>
          <article><span>03</span><h3>Food & Culture</h3><p>Markets, local tables, tea, architecture and meaningful encounters.</p></article>
          <article><span>04</span><h3>Wild Japan</h3><p>Alpine trails, island waters, cycling routes and national parks.</p></article>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-visual"><img src="/places/kyoto.webp" alt="Vermilion torii gates in Kyoto" /><span>京都 · KYOTO</span></div>
        <div className="about-copy">
          <p className="eyebrow dark">YOUR LOCAL JAPAN SPECIALIST</p>
          <h2>Europe in mind.<br />Japan at heart.</h2>
          <p>I help European travellers experience Japan with confidence—from the first idea to the final train connection. You receive honest local advice, clear planning and human support.</p>
          <ul>
            <li><span>01</span> Itinerary designed around your pace</li>
            <li><span>02</span> European-language communication</li>
            <li><span>03</span> Local logistics and cultural guidance</li>
          </ul>
        </div>
      </section>

      <section className="plan-section" id="plan">
        <div className="plan-heading">
          <p className="eyebrow">START WITH A DREAM</p>
          <h2>{t[9]}</h2>
          <p>{t[10]}</p>
          <div className="plan-note"><span>✦</span><p><b>Reply within 1 business day</b><br />Your first conversation is free.</p></div>
        </div>
        <form onSubmit={submitInquiry} className="inquiry-form">
          <div className="field-row"><label>Your name<input required name="name" autoComplete="name" /></label><label>Email<input required type="email" name="email" autoComplete="email" /></label></div>
          <div className="field-row"><label>Travel month<input type="month" name="month" /></label><label>Travellers<select name="travellers" defaultValue="2"><option>1</option><option>2</option><option>3–4</option><option>5+</option></select></label></div>
          <label>What would make this trip unforgettable?<textarea name="message" rows={4} placeholder="Food, art, nature, a special celebration…" /></label>
          <button className="button submit-button" type="submit">{sent ? "✓ Thank you — I’ll be in touch" : t[11]} <span>→</span></button>
        </form>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">心</span><span>KOKORO <b>JAPAN</b></span></div>
        <p>Private Japan journeys, designed locally for Europe.</p>
        <div><a href="#places">Destinations</a><a href="#plan">Plan a trip</a><a href="https://sunveda.tech">sunveda.tech</a></div>
        <small>© 2026 Kokoro Japan Journeys · Destination references: Japan National Tourism Organization · Photography: Wikimedia Commons contributors</small>
      </footer>
    </main>
  );
}
