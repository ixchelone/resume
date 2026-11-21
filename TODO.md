# TODO – Resume Website & CV Improvement Plan

**Audit baseline:** 20. listopadu 2026  
**Repository:** [ixchelone/resume](https://github.com/ixchelone/resume)  
**Baseline branch / commit:** `main` / `0ea805ae5f6d3337362626e9b3b98e8b398c0b1b`  
**Detailní kontext:** [`project-analysis.md`](./project-analysis.md)

Tento TODO je prováděcí plán. Každý úkol obsahuje cíl, konkrétní kroky, pravděpodobně dotčené soubory, závislosti a akceptační kritéria. Úkoly, které vyžadují osobní informace nebo skutečné pracovní výsledky, nelze dokončit pouhou editací kódu.

## Prioritizace

- **P0 – kritické / nejvyšší dopad:** opravit prázdná metadata, odstranit zbytkový text, ověřit hlavní tvrzení CV, zlepšit pracovní zkušenosti a vyřešit mezeru v časové ose.
- **P1 – důležitý obsah a konzistence:** positioning, Summary, Skills, Credentials, CI validace a shoda lokálního buildu s CI.
- **P2 – údržba a dlouhodobá kvalita:** Worker Range behavior, frontend knihovny, CSS cleanup, rozsáhlejší regresní a přístupnostní testy.

## Pracovní pravidla

- Zachovat oddělení obsahu (`content/`, `data/`), prezentačních partialů a layout orchestrace.
- Needitovat přímo upstream theme v `themes/resume/`; používat projektové overrides.
- Po každé logické změně vytvořit lokální Hugo build a zkontrolovat výsledek.
- Pro lokální build používat stejnou Hugo Extended verzi jako CI.
- Po změnách obsahu zkontrolovat JSON syntaxi.
- Jednotlivé nesouvisející změny commitovat odděleně podle Conventional Commits a pravidel z README.
- Nevymýšlet měřitelné výsledky; použít pouze údaje, které lze doložit nebo poctivě vysvětlit.
- Necommitovat `public/` ani `resources/`; jsou generované a v `.gitignore`.

---

# P0 – Rychlé opravy a nejvyšší dopad

## P0.1 – Doplnit metadata homepage a social sharing

**Problém:** `meta description` a `og:description` jsou prázdné; `meta author` je prázdný. Chybí některé doporučené Open Graph a Twitter Card údaje. `config.toml` obsahuje `brandName`, ale nemá `description` ani samostatný `author`.

**Dotčené soubory:**

- `config.toml`
- `layouts/_default/baseof.html`
- případně nový social preview obrázek v `static/images/`

### Kroky

- [ ] Rozhodnout finální profesní wording pro metadata. Neopisovat bez úpravy neurčitou frázi „Linux / DevOps / Cloud engineer in Prague…“.
- [ ] Přidat do `[params]` kvalitní homepage `description`.
- [ ] Rozhodnout, zda `author` bude explicitní parametr, nebo se použije `brandName` jako fallback.
- [ ] Nepřidávat bez rozmyslu `firstName` a `lastName`: About partial je používá pro vykreslení dodatečné kontaktní hlavičky a mohlo by dojít k duplicitnímu jménu.
- [ ] Upravit `meta name="author"`, aby mělo neprázdnou hodnotu.
- [ ] Upravit `meta name="description"` tak, aby při chybějícím `.Description` používalo vhodný site-level fallback.
- [ ] Doplnit `og:description` se stejným nebo vhodně zkráceným textem.
- [ ] Doplnit `og:url` s canonical absolutní URL aktuální stránky.
- [ ] Doplnit `og:type="website"`.
- [ ] Doplnit `og:site_name`.
- [ ] Zvážit `og:image:alt`.
- [ ] Doplnit Twitter Card metadata: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- [ ] Zvážit canonical `<link rel="canonical">`.
- [ ] Ověřit HTML escaping / bezpečné vkládání hodnot do atributů.
- [ ] Zvážit sjednocení `<html lang="en">` s Hugo `languageCode = "en-us"`.

### Social preview obrázek

- [ ] Prověřit stávající `static/images/inguz.png` (512 × 512 px) jako Open Graph obrázek.
- [ ] Rozhodnout, zda vytvořit samostatný široký social preview banner (např. 1200 × 630 px) se jménem a profesním zaměřením.
- [ ] Doplnit do konfigurace parametr `ogImage` a používat jej v `og:image`.
- [ ] Ověřit, že obrázek existuje, je veřejně dostupný přes absolutní HTTPS URL a odpovídá `image/png` nebo `image/jpeg`.
- [ ] Otestovat náhled přes LinkedIn Post Inspector; případně další social preview debugger.

### Akceptační kritéria

- [ ] Žádná relevantní meta hodnota není prázdná.
- [ ] Author je zobrazen správně a About nemá duplicitní kontaktní hlavičku.
- [ ] Homepage a ostatní stránky mají správný canonical URL a fallback description.
- [ ] Open Graph a Twitter metadata se zobrazují správně v HTML a social preview používá správný obrázek.

---

## P0.2 – Opravit počáteční stav badge lightbox obrázku

**Problém:** `baseof.html` obsahuje `<img id="badge-image" alt="Course badge">` bez `src`. Uživatel nahlásil zobrazení „Course badge“ na konci stránky.

**Dotčené soubory:**

- `layouts/_default/baseof.html`
- případně `assets/css/resume-override.css`

### Kroky

- [ ] Zkontrolovat počáteční DOM a computed visibility obrázku při běžném načtení stránky.
- [ ] Přidat explicitní počáteční skrytí obrázku, dokud není úspěšně načten (např. `hidden` / vlastní stavová třída).
- [ ] Zkontrolovat CSS `.ilx-lightbox img { display: block; }`; zajistit, aby obecné `display:block` nepřebilo počáteční skrytí.
- [ ] Při úspěšném načtení předobrazu nastavit `img.src` a zobrazit obrázek až při otevření lightboxu.
- [ ] Při zavření obrázek opět skrýt a odstranit `src`.
- [ ] Zachovat přístupný a smysluplný `alt` text; neřešit problém pouze vymazáním alternativního textu.
- [ ] Ošetřit neúspěšné načtení obrázku tak, aby se lightbox neotevřel s rozbitým obrázkem.
- [ ] Otestovat kliknutí na badge odkaz, zavření tlačítkem, kliknutí mimo dialog a klávesu Escape.
- [ ] Ověřit, že při běžném načtení stránky není vidět text „Course badge“ ani ikona rozbitého obrázku.

### Akceptační kritéria

- [ ] Při běžném načtení stránky není badge image viditelný.
- [ ] Kliknutí na badge otevře lightbox se správným obrázkem.
- [ ] Po zavření se obrázek skryje a `src` se odstraní.
- [ ] Neúspěšné načtení nezanechá rozbitý lightbox.
- [ ] Klávesové ovládání zůstane funkční.

---

## P0.3 – Přepsat Employment History na výsledky a dopady

**Problém:** 37 highlightů napříč pěti pozicemi převážně popisuje úkoly, nástroje a technologie. Doporučený výsledný rozsah je 2–4 silné body na roli.

**Dotčené soubory:**

- `data/employment.json`
- případně `layouts/shortcodes/employment.html` pouze pokud bude potřeba změnit způsob vykreslení

### Společné zásady

- [ ] Každý bod začínat silným slovesem: Built, Automated, Resolved, Improved, Migrated, Supported, Implemented, Streamlined apod.
- [ ] Popsat kontext a rozsah: systémy, služby, servery, uživatelé, prostředí, týmy, počet nasazení.
- [ ] Popsat dopad: vyšší dostupnost, rychlejší diagnostika, lepší přehled, méně ruční práce, spolehlivější nasazení, kvalitnější předávání.
- [ ] Používat čísla pouze z ověřitelné zkušenosti nebo poctivého odhadu, který lze vysvětlit.
- [ ] Pokud není dostupná metrika, použít pravdivý kvalitativní výsledek.
- [ ] Nepoužívat vymyšlená procenta, časy, počty serverů, služby SLA ani „zero downtime“.
- [ ] Vybrat 2–4 nejlepší body na pozici; zbytek sloučit nebo odstranit.
- [ ] Udržet konzistentní minulý čas a profesionální angličtinu.
- [ ] Vyhnout se opakování stejné informace v `summary` a highlights.
- [ ] Udržet nejrelevantnější a nejčerstvější zkušenosti nejdetailnější; starší role mohou být stručnější.

### Zentity – Infrastructure Engineer (2023-09 až 2024-08)

Současné oblasti: L2/L3 support telco vendorů, OpenShift a Docker, Azure infrastructure scoping, firewall/gateway review, Jenkins/Nexus, Zabbix, Python/Bash cron automation, Postman, Nginx, Redis a ITIL 4 workflows.

- [ ] Zjistit počet a typ telco vendorů / projektů, které byly podporovány.
- [ ] Zjistit typické odpovědnosti L2/L3: incidenty, deploymenty, troubleshooting, změny, eskalace.
- [ ] Zjistit rozsah OpenShift/Docker prostředí: aplikace, namespaces, clustery, prostředí, deployment frequency.
- [ ] Popsat konkrétní problémy při nasazení a jejich vyřešení; nevymýšlet počet aplikací.
- [ ] Ověřit roli při Azure scoping: které komponenty byly navrhovány nebo posuzovány a jaký byl výstup.
- [ ] Zjistit rozsah firewall/gateway review a konkrétní přínos pro bezpečnost nebo síťové provozování.
- [ ] U Jenkins/Nexus zjistit typ CI/CD problémů, které byly řešeny, a dopad na release / deployment flow.
- [ ] U Zabbix dashboardů zjistit počet hostů / služeb / týmů a co dashboardy zlepšily.
- [ ] U Python/Bash cron skriptů zjistit, jaký ruční proces automatizovaly, jak často běžely a jaký čas či chyby ušetřily.
- [ ] U Postman/Nginx/Redis rozlišit diagnostiku API, konfiguraci proxy a práci s databázovými službami; spojit do jednoho relevantního bodu jen pokud to dává smysl.
- [ ] U ITIL 4 zjistit konkrétní změnu v workflow / handover a její výsledek.
- [ ] Vybrat 3–4 nejvýznamnější výsledky.

### T-Mobile – Application Administrator & Solution Manager Deputy (2022-05 až 2023-08)

Současné oblasti: enterprise VoIP, Apache web servers, RCA, Linux/Oracle SQL, TrueSight/Dynatrace, SSL certificates, HP Service Manager, external KB, change approvals a Avaya Genesys roles.

- [ ] Zjistit rozsah VoIP prostředí: uživatelé, systémy, lokality nebo aplikace, pokud je možné údaj uvést.
- [ ] Vybrat příklad významného incidentu/RCA: problém, tvoje role, výsledek a případně čas vyřešení.
- [ ] Ověřit rozsah Linux a Oracle DB administrace: počet systémů, typ změn, patching cadence nebo kritičnost prostředí.
- [ ] Zjistit, co se monitorovalo přes TrueSight a Dynatrace a jak monitoring pomáhal při diagnostice.
- [ ] Zjistit počet / rozsah SSL certifikátů nebo serverů a jaká byla tvoje odpovědnost.
- [ ] Popsat konkrétní zlepšení ITSM workflow v HP Service Manager.
- [ ] Ověřit, kdo používal external KB a jak její správa zlepšila support / handover.
- [ ] Zjistit typ a přibližný rozsah change approvals / implementací.
- [ ] U Avaya Genesys popsat správu rolí a oprávnění, případně rozsah uživatelů.
- [ ] Vybrat 3–4 výsledky a odstranit duplicity.

### Chyron – Technical Support Engineer (Customer Success) (2020-12 až 2022-04)

Současné oblasti: 40+ serverů v Zabbix/Grafana, CentOS/Windows, storage, VMware ESXi, ELK, MySQL clusters, Python regex scripting, test/prod migrations, EMEA/US support, německý POC, Salesforce, Confluence a G-Suite.

- [ ] Zachovat ověřený údaj „40+ servers“.
- [ ] Zjistit, zda šlo o monitoring, administraci nebo obojí, a jaké typy služeb byly monitorovány.
- [ ] Zjistit příklad incidentu, který monitoring pomohl odhalit nebo diagnostikovat.
- [ ] Ověřit, jaké storage/updates/upgrades se spravovaly a jaký byl rozsah.
- [ ] Zjistit rozsah VMware ESXi, ELK a MySQL clusterů (počet hostů/node, prostředí, úlohy).
- [ ] U Python regex skriptů popsat konkrétní konfigurační úkon, který byl automatizován nebo zjednodušen.
- [ ] U test/prod migrací zjistit frequency, počet nebo typ změn a zlepšení procesu.
- [ ] Ověřit rozsah podpory EMEA/US týmů a roli německého POC.
- [ ] Popsat přínos Salesforce Customer Success / ITSM workflow.
- [ ] Vybrat 3–4 nejsilnější body; zachovat 40+ serverů jako konkrétní rozsah.

### Amazon – OpsTech IT Engineer (2020-07 až 2020-09)

Současné oblasti: remote IT support pro B2B/B2C, německý POC, Windows/Mac workstations, printers/mobile devices, AD/GPO, security awareness training, Sysmon/Procmon/PowerShell.

- [ ] Zjistit přibližný objem support požadavků nebo typickou zátěž, pokud je zapamatovatelná.
- [ ] Zjistit typy zákazníků / uživatelů a regionální či jazykovou odpovědnost.
- [ ] Ověřit počet nebo rozsah workstation konfigurací / troubleshootingů.
- [ ] U AD/GPO určit, zda šlo o správu účtů, skupin, oprávnění a policy změn; doplnit měřítko pouze pokud známé.
- [ ] U security awareness training ověřit cílovou skupinu a přibližný rozsah.
- [ ] Popsat, jak Sysmon/Procmon/PowerShell pomáhaly při diagnostice nebo security troubleshooting.
- [ ] Vybrat 2–3 body relevantní pro cílové infrastructure role.

### NTT – Network Engineer (2019-04 až 2020-06)

Současné oblasti: L1 network support, Cisco, incident resolution, on-call, německý POC, RCA, ServiceNow KB, Meraki dashboards, network changes/upgrades a CCNA study topics.

- [ ] Zjistit rozsah síťového prostředí: zařízení, lokality, sites nebo typy Cisco infrastruktury.
- [ ] Zjistit průměrný nebo typický ticket volume, pokud je údaj známý.
- [ ] Popsat roli v on-call rotaci a německém POC.
- [ ] Vybrat příklad RCA a vysvětlit přínos pro řešení incidentu / prevenci opakování.
- [ ] Ověřit, jak byla používána ServiceNow KB a jaký byl její přínos.
- [ ] Zjistit, jaké síťové změny/upgrady byly podporovány a v jakém rozsahu.
- [ ] Zvážit odstranění „Studied CCNA R&S topics…“ z pracovních highlights; studium témat není pracovní výsledek a může být uvedeno jako znalost v Skills, pokud je stále relevantní.
- [ ] Vybrat 2–3 nejlepší body.

### Akceptační kritéria Employment History

- [ ] Každá role má 2–4 konkrétní a relevantní body (přiměřeně délce a senioritě role).
- [ ] Nejméně jeden bod u každé relevantní role popisuje výsledek/dopad, nikoli jen použitý nástroj.
- [ ] Každé číslo je ověřitelné nebo jasně označený poctivý odhad.
- [ ] Nejsou doplněny nepravdivé výsledky ani technologie.
- [ ] Angličtina je konzistentní, stručná a profesionální.
- [ ] Vykreslení na desktopu a mobilu zůstává čitelné.

---

# P1 – Profesní prezentace a datová konzistence

## P1.1 – Vybrat headline / cílové role

- [ ] Rozhodnout, zda primární cílení bude Infrastructure & Cloud Engineer, IT Infrastructure Engineer nebo Cloud & DevOps Engineer.
- [ ] Projít aktuální pracovní nabídky, na které má CV cílit, a identifikovat opakující se požadavky.
- [ ] Porovnat požadavky s doloženou praxí v `employment.json` a `skills.json`.
- [ ] Zvolit jeden primární headline; alternativní CV verzi lze vytvořit později.
- [ ] Zkontrolovat konzistenci headline v About, PDF CV, metadata a případně LinkedIn.

**Akceptace:** headline přesně popisuje profil a nepřeceňuje cloud / DevOps senioritu.

## P1.2 – Přepsat Professional Summary

**Soubor:** `content/about/index.md`.

- [ ] Po výběru headline upravit první větu.
- [ ] Ověřit délku IT zkušeností před uvedením čísel.
- [ ] Vybrat 3–5 hlavních technických oblastí, které jsou doložené Employment History.
- [ ] Připomenout typy prostředí (např. telco, media technology, enterprise IT), pokud jsou relevantní pro cílové role.
- [ ] Nahradit „broad technical skill set“ konkrétními technologiemi a kompetencemi.
- [ ] Odstranit nebo přeformulovat obecné fráze „take initiative to maintain momentum“ a „keep communication plain and actionable“, pokud nepřinášejí konkrétní hodnotu.
- [ ] Nepoužívat více buzzwordů než potřebuje stručné profesní shrnutí.
- [ ] Udržet přibližně 3–4 věty a přiměřenou délku.
- [ ] Připravit dvě varianty, pokud bude potřeba obecný a cílený profil (Infrastructure / Cloud & DevOps).

**Akceptace:** Summary je konkrétní, odpovídá uvedeným zkušenostem a nevytváří nepodložená tvrzení.

## P1.3 – Období po srpnu 2024 / Projects / Professional Development

**Možné soubory:** nové `data/projects.json`, `layouts/shortcodes/projects.html`, `content/_index.md`, případně samostatný headless content bundle.

### Získání faktů

- [ ] Sepsat skutečné aktivity od září 2024 do současnosti.
- [ ] U každé aktivity uvést začátek/konec nebo období.
- [ ] Rozlišit zaměstnání, freelance, osobní projekt, kurz, samostudium a osobní přestávku.
- [ ] Vybrat pouze aktivity relevantní pro profesní profil.
- [ ] Rozhodnout, zda použít `Selected Projects`, `Professional Development` nebo `Career Break`.
- [ ] Nepopisovat osobní důvody, pokud je nechceš sdílet.

### Personal Resume Website jako možný projekt

Repozitář dokládá osobní projekt s následujícími technologiemi a činnostmi:

- Hugo static site generation;
- Markdown a JSON content model;
- custom layouts, partials, shortcodes a CSS;
- GitHub Actions CI/CD;
- Cloudflare Pages deployment;
- Cloudflare Worker pro PDF proxy;
- GitHub Releases jako storage PDF dokumentů;
- custom domain a DNS přes Cloudflare.

- [ ] Ověřit skutečné datum zahájení / hlavní období práce na projektu.
- [ ] Rozhodnout, zda má být projekt v CV uveden jako `Personal Project`.
- [ ] Vybrat 2–4 konkrétní technické výsledky, které lze doložit repozitářem.
- [ ] Neprezentovat jej jako komerční pracovní roli.
- [ ] Zvážit, zda existují další relevantní osobní projekty, které mohou být v sekci uvedeny.

### Akceptace

- [ ] CV neobsahuje nevysvětlenou časovou osu, pokud existuje relevantní obsah, který lze pravdivě uvést.
- [ ] Žádná aktivita není prezentována jako zaměstnání, pokud zaměstnáním nebyla.
- [ ] Osobní projekty mají jasné názvy, technologie, období a stručný výsledek.

## P1.4 – Uspořádat a kategorizovat Technical Skills

**Soubor:** `data/skills.json`.

### Oprava konkrétních položek

- [ ] Přesunout `Postman` ze Security do `API & Testing` nebo podobné kategorie.
- [ ] Ověřit, zda `Visual Studio` znamená Microsoft Visual Studio, nebo Visual Studio Code.
- [ ] Pokud jde o IDE, přesunout z Version Control do `Developer Tools` / `Development Tools`.
- [ ] Ponechat Git ve Version Control.
- [ ] Přesunout nginx a Apache z Networking do `Web Infrastructure`, `Web Servers & Reverse Proxies` nebo ekvivalentní kategorie.
- [ ] Rozdělit `VMware ESXi Hyper-V` na dvě samostatné položky.
- [ ] Ověřit, zda obě virtualizační technologie patří do Cloud Computing nebo Virtualization.
- [ ] Nahradit `CCNA-level concepts` konkrétními síťovými oblastmi (jen ty, které skutečně ovládáš), nebo položku odstranit.
- [ ] Ověřit přesný význam a relevanci `DQL (Obsidian)`.
- [ ] Posoudit relevanci `AI-assisted coding` a `Prompt engineering` pro cílové IT pozice.
- [ ] Zkontrolovat, zda jsou AWS služby rozepsané srozumitelně (WorkSpaces, S3, CloudTrail).
- [ ] Zkontrolovat Cloudflare položku (DNS, Pages, Workers) a ponechat ji v Cloud Computing / Platform Engineering podle cílového profilu.
- [ ] Zkontrolovat názvy a kapitalizaci technologií (VMware, OpenShift, Nginx/nginx, PowerShell apod.).

### Rozhodnout proficiency model

- [ ] Rozhodnout, zda používat tři úrovně `Core`, `Working Knowledge`, `Familiarity`, nebo pouze dvě skupiny `Core Competencies` a `Additional Tools & Technologies`.
- [ ] U každé položky provést realistické sebehodnocení.
- [ ] Nepoužívat procentní progress bary ani čísla, která nemají objektivní význam.
- [ ] Rozhodnout datový model: objekty `{name, level}`, samostatné seznamy, nebo jiné jednoduché schéma.
- [ ] Upravit `skills.html` podle rozhodnutého schématu.
- [ ] Zachovat čitelnost, responzivní layout a přístupnost.
- [ ] Pokud je úroveň uvedena, vysvětlit ji konzistentním vizuálním/legend systémem.
- [ ] Nepřidávat levely, dokud není hotové skutečné sebehodnocení.

### Akceptace

- [ ] Žádná položka není ve zjevně nesprávné kategorii.
- [ ] Nejasné názvy jsou opravené nebo odstraněné.
- [ ] Core technologie jsou vizuálně odlišitelné od doplňkových.
- [ ] Všechny úrovně jsou obhajitelné konkrétní zkušeností.
- [ ] Skills nejsou jen co nejdelší seznam; podporují cílové pracovní role.

## P1.5 – Zpřesnit názvy Credentials podsekcí

**Soubor:** `layouts/shortcodes/credentials.html`.

Současné skupiny:

- `Certifications` – 3 PeopleCert certifikace s ID a expirací.
- `Certificates` – 4 dokončené programy / školení.
- `Courses` – 8 kurzů a webinářů.

### Doporučené nadpisy

- [ ] `Certifications` → `Professional Certifications`.
- [ ] `Certificates` → `Training & Program Certificates`.
- [ ] `Courses` → `Courses & Webinars`.
- [ ] Při změně nadpisů zachovat anchor IDs `certifications`, `certificates`, `courses`, aby zůstaly stabilní existující odkazy.
- [ ] Zkontrolovat, že `Professional Certifications` obsahuje skutečné profesní certifikace s příslušným assessmentem / vydavatelem.
- [ ] Zkontrolovat oficiální název `Google Cybersecurity Professional` a případné doplnění veřejného ověřovacího odkazu; současný záznam nemá `url`.
- [ ] Ověřit issuer, subtitles a data všech položek.
- [ ] Ověřit expirace certifikací PeopleCert.
- [ ] Rozhodnout, zda každý webinar v Courses přináší relevantní informaci, nebo je možné skupinu zkrátit.
- [ ] Zachovat správné třídění podle data a formátování rozsahů.

### Akceptace

- [ ] Názvy sekcí jasně rozlišují formální profesní certifikaci od dokončeného kurzu/programu.
- [ ] Anchor IDs zůstávají funkční.
- [ ] Data a odkazy jsou ověřené.

## P1.6 – Opravit nejasnosti v Education

**Soubor:** `data/education.json`.

- [ ] Ověřit, zda `Bachelor's (terminated)` je nejpřesnější a pro anglicky mluvícího recruitera srozumitelný popis studia na Ambis.
- [ ] Ověřit, zda `Bachelor's (transferred)` u University of Economics nevytváří dojem získaného titulu. Pokud šlo pouze o nedokončené studium a přenos kreditů, zvážit přesnější text typu `Bachelor's studies (transferred)`.
- [ ] Zkontrolovat anglické názvy institucí a studijních oborů.
- [ ] Zachovat pravdivé datum a místo.

---

# P1 – CI, reprodukovatelnost a data

## P1.7 – Sjednotit Hugo Extended verzi

**Soubory:** `.github/workflows/hugo.yaml`, lokální vývojové instrukce / README, případně instalační skript.

- [ ] Potvrdit CI verzi `0.141.0` jako projektový standard.
- [ ] Nainstalovat / používat lokálně Hugo Extended 0.141.0.
- [ ] Ověřit, že lokální `hugo version` odpovídá CI.
- [ ] Aktualizovat README, aby lokální prerequisites odpovídaly připnuté verzi.
- [ ] Smazat a znovu generovat starý `public/` pomocí aktuální verze.
- [ ] Porovnat lokální build s CI buildem.

**Akceptace:** lokální a CI build používají stejnou verzi Hugo Extended a nevznikají rozdíly jen kvůli verzi generátoru.

## P1.8 – Přidat JSON validaci do GitHub Actions

**Soubor:** `.github/workflows/hugo.yaml`.

- [ ] Přidat samostatný krok před Hugo buildem.
- [ ] Projít všechny `data/*.json`.
- [ ] Použít `jq empty "$file"` nebo ekvivalentní validaci.
- [ ] Nastavit shell tak, aby chyba jednoho souboru zastavila workflow.
- [ ] V logu vypsat název právě validovaného souboru.
- [ ] Otestovat úmyslně rozbitý JSON a ověřit, že workflow selže před deployem.
- [ ] Ověřit úspěšný workflow po návratu validního JSON.

Příklad kroku:

```yaml
- name: Validate JSON data
  run: |
    for file in data/*.json; do
      echo "Validating $file"
      jq empty "$file"
    done
```

### Volitelné rozšíření

- [ ] Zvážit validaci povinných polí pro jednotlivé soubory.
- [ ] Pro `employment.json` ověřit `role`, `company`, `start`, `end`, `summary` a `highlights`.
- [ ] Pro `skills.json` ověřit `category` a pole `items`.
- [ ] Pro credentials ověřit `title`, `issuer` a formát `date`.
- [ ] Nezavádět plný JSON Schema systém, pokud jednoduché kontroly stačí.

**Akceptace:** syntakticky chybný JSON nemůže projít do production deploymentu.

## P1.9 – Opravit CSS syntaxi a odstranit duplicity

**Soubor:** `assets/css/resume-override.css`.

- [ ] Opravit neuzavřený komentář začínající `/* Intro heading` kolem řádku 94.
- [ ] Zajistit, aby `.intro-title` a `.intro-subtitle` byly aktivní CSS selektory.
- [ ] Zkontrolovat správné uzavření komentářů v celém CSS souboru.
- [ ] Sloučit duplicitní `@media (min-width: 992px)` pravidla pro horizontální padding sekcí.
- [ ] Vyhledat všechny výskyty `hr.m-0` v projektu a theme.
- [ ] Pokud již nejsou používány, odstranit nevyužité pravidlo `hr.m-0`.
- [ ] Ověřit, že společné paddingy a inset section dividers zůstávají beze změny.
- [ ] Otestovat About heading/subtitle, Credentials headings a mobilní zobrazení.

**Akceptace:** CSS je syntakticky správné, intro selektory se aplikují a nejsou zbytečně duplikovaná pravidla.

---

# P2 – PDF Worker a technická údržba

## P2.1 – Prověřit a sjednotit Range request podporu PDF Workeru

**Soubory:**

- `cloudflare/_worker.js`
- `cloudflare/README.md`
- `README.md`

### Ověření současného chování

- [ ] Odeslat na produkční PDF URL request s `Range: bytes=0-1023`.
- [ ] Zkontrolovat, zda odpověď má status `206 Partial Content`.
- [ ] Zkontrolovat `Content-Range`, `Content-Length` a `Accept-Ranges`.
- [ ] Zopakovat test s `HEAD` requestem.
- [ ] Porovnat upstream GitHub Release endpoint s vlastní Worker URL.
- [ ] Zjistit, zda současná implementace opravdu podporuje partial responses, jak tvrdí README.

### Pokud Range není funkční a je žádoucí

- [ ] Předávat do upstream fetch pouze potřebné hlavičky `Range` a `If-Range`.
- [ ] Zachovat `User-Agent`.
- [ ] Zachovat povolené metody GET a HEAD.
- [ ] Převzít upstream status a relevantní hlavičky, zejména `Content-Range`, `Content-Length` a `Accept-Ranges`.
- [ ] Otestovat správné chování pro 200, 206, 404 a případné upstream chyby.
- [ ] Ověřit, že se nepropagují citlivé nebo nepotřebné request headers.
- [ ] Nasadit a ověřit znovu v produkci.

### Pokud Range není potřebný nebo není podporovaný

- [ ] Upravit README a odstranit tvrzení o 206 / byte-range podpoře, která není skutečně ověřena.
- [ ] Popsat pravdivé chování PDF delivery.

**Akceptace:** README a Worker odpovídají skutečnému produkčnímu chování.

## P2.2 – Naplánovat migraci Bootstrap 4 a jQuery

**Dotčené soubory:**

- `assets/css/vendor/bootstrap-4.5.3.min.css`
- `static/js/vendor/bootstrap.bundle-4.5.3.min.js`
- `static/js/vendor/jquery-3.6.4.slim.min.js`
- `layouts/partials/nav.html`
- `static/js/site/navbar-collapse.js`
- `static/js/site/scrollspy-init.js`
- další CSS / HTML s Bootstrap 4 třídami a data atributy

### Inventarizace

- [ ] Vyhledat `data-toggle`, `data-target`, `data-spy`, `data-offset` a další Bootstrap 4 API.
- [ ] Vyhledat jQuery `$()` / `$.` ve vlastních skriptech.
- [ ] Identifikovat, které Bootstrap komponenty se skutečně používají.
- [ ] Zkontrolovat nav collapse a scrollspy zvlášť; obě části jsou důležité pro mobilní navigaci.

### Migrace

- [ ] Rozhodnout, zda cílem bude Bootstrap 5.
- [ ] Připravit kompatibilní `data-bs-*` atributy a JS API.
- [ ] Převést `navbar-collapse.js` z jQuery na Bootstrap Collapse API nebo vanilla JS.
- [ ] Převést `scrollspy-init.js` na Bootstrap 5 ScrollSpy nebo vhodné IntersectionObserver řešení.
- [ ] Ověřit všechny používané Bootstrap utilities a případné změny tříd.
- [ ] Odstranit jQuery až po odstranění všech závislostí.
- [ ] Aktualizovat vendor soubory a README.

### Regresní testy

- [ ] Mobilní menu se otevře a zavře.
- [ ] Kliknutí na navigační link menu zavře.
- [ ] Kotvy scrollují na správnou sekci a nadpis není pod fixed navigation.
- [ ] Scrollspy zvýrazňuje správnou položku menu.
- [ ] Desktop sidebar navigace zůstane funkční.
- [ ] Badge lightbox funguje.
- [ ] PDF link behavior zůstane zachovaný.

**Akceptace:** migrace neporuší navigaci ani responzivní layout; jQuery lze odstranit bez ztráty funkcionality.

## P2.3 – Aktualizovat README podle aktuální implementace

**Soubory:** `README.md`, `cloudflare/README.md`.

- [ ] Ověřit, že popis obsahu webu odpovídá aktuálním sekcím a skutečným funkcím.
- [ ] Aktualizovat metadata / SEO část, pokud bude doplněna.
- [ ] Aktualizovat lokální Hugo verzi a příkaz pro build.
- [ ] Aktualizovat popis Skills a Credentials podle nových názvů.
- [ ] Ověřit PDF Worker Range request tvrzení a upravit podle skutečnosti.
- [ ] Zkontrolovat příklady JSON a používané PDF fragmenty.
- [ ] Zachovat přesný popis Cloudflare Pages, GitHub Releases a Worker architektury.

## P2.4 – Zvážit hardening GitHub Actions

**Soubor:** `.github/workflows/hugo.yaml`.

- [ ] Průběžně aktualizovat `actions/checkout`, `peaceiris/actions-hugo`, `actions/cache` a `cloudflare/wrangler-action`.
- [ ] Zvážit pinování actions na plné commit SHA podle bezpečnostní politiky projektu.
- [ ] Zachovat minimální permissions.
- [ ] Ověřit, že concurrency group stále správně ruší zastaralé deploye.
- [ ] Ověřit, že `paths` filtr zahrnuje všechny soubory, které mají spustit nový build/deploy.
- [ ] Nepřidávat zbytečné deployment trigger pro čistě dokumentační soubory, pokud to není požadováno.

---

# P2 – Finální QA / akceptační testy

## P2.5 – Hugo build a struktura HTML

- [ ] Spustit `hugo --gc --minify --cleanDestinationDir` se stejnou verzí jako CI.
- [ ] Build nesmí obsahovat chyby ani nevyřešená varování.
- [ ] Ověřit počet `id="about"`, `id="languages"`, `id="skills"`, `id="employment"`, `id="education"`, `id="credentials"` – každé ID právě jednou.
- [ ] Ověřit, že hlavní sekce jsou sourozenecké elementy, ne vnořené uvnitř About.
- [ ] Ověřit, že `content/about/index.md` je headless a nevytváří samostatnou veřejnou stránku.
- [ ] Ověřit správné pořadí sekcí.
- [ ] Ověřit, že se `public/` negeneruje do Git working tree (zůstává ignorované).

## P2.6 – Metadata a social preview

- [ ] Zkontrolovat vygenerovaný HTML `<title>`.
- [ ] Zkontrolovat `meta description` a `meta author`.
- [ ] Zkontrolovat `og:title`, `og:description`, `og:url`, `og:type`, `og:image`.
- [ ] Zkontrolovat Twitter Card metadata.
- [ ] Zkontrolovat, že žádný content atribut není prázdný nebo obsahuje `nil`.
- [ ] Ověřit, že social preview image vrací HTTP 200 a správný Content-Type.
- [ ] Ověřit náhled na LinkedIn Post Inspector po deploymentu.

## P2.7 – Responsive / browser QA

Testovat alespoň:

- [ ] Desktop Chrome.
- [ ] Desktop Firefox.
- [ ] Desktop Edge.
- [ ] Mobilní Chrome.
- [ ] Mobilní Firefox / případně Opera podle dostupnosti.

V každém relevantním viewportu ověřit:

- [ ] Růžová navbar / sidebar.
- [ ] Otevření a zavření mobile menu.
- [ ] Správné scroll position pro About, Languages, Skills, Employment, Education a Credentials.
- [ ] Správné odsazení obsahu a dividerů.
- [ ] Čitelnost Employment History.
- [ ] Skills layout a zalamování chipů.
- [ ] Credentials layout a data na mobilu.
- [ ] Footer a absence zbytkového „Course badge“ textu.
- [ ] Žádný horizontální overflow.

## P2.8 – PDF a credentials QA

- [ ] Ověřit všechny PDF URL v `certifications.json`, `certificates.json`, `courses.json`.
- [ ] Ověřit všechny PDF linky v navigaci a v CV.
- [ ] Ověřit, že fragmenty `#view=FitV&zoom=page-height` se zachovaly.
- [ ] Otestovat alespoň jeden PDF odkaz v Chrome, Firefox a Edge.
- [ ] Ověřit, že externí link na EverAfter funguje.
- [ ] Ověřit badge lightbox pro každou badge položku.
- [ ] Ověřit 404/error handling pro neexistující PDF.
- [ ] Ověřit Range request behavior podle P2.1.

## P2.9 – Přístupnost a obsahová kontrola

- [ ] Zkontrolovat jednoznačné H1/H2 hierarchy.
- [ ] Zkontrolovat alt text pro profilový obrázek, social preview a badge.
- [ ] Zkontrolovat klávesové ovládání lightboxu a nav.
- [ ] Zkontrolovat focus behavior po otevření/zavření lightboxu.
- [ ] Zkontrolovat kontrast textu na růžovém pozadí a sekundárních barvách.
- [ ] Zkontrolovat srozumitelnost názvů sekcí a technologických kategorií.
- [ ] Zkontrolovat gramatiku a konzistenci anglického textu.

---

# Závislosti a pořadí práce

1. **Nejdříve ověřit délku zkušeností a cílový headline.** Na tom závisí Summary, meta description a výběr hlavních Skills.
2. **Metadata a Course badge lze opravit nezávisle** a provést jako první technické commity.
3. **Employment History vyžaduje nejprve získat fakta.** Až poté přepisovat JSON.
4. **Employment gap / Projects závisí na seznamu skutečných aktivit po srpnu 2024.**
5. **Skills úrovně vyžadují sebehodnocení.** Nejdříve rozhodnout model, až poté měnit data a shortcode.
6. **Credentials naming je malá nezávislá změna** v `credentials.html`.
7. **Bootstrap migrace je samostatný větší projekt** a neměla by se míchat s obsahovými commity.
8. **Worker Range oprava musí navazovat na test**; nejdříve zjistit skutečné produkční chování.

---

# Rozhodnutí a informace, které musí dodat vlastník CV

- [ ] Jaké pracovní pozice chceš primárně cílit: IT Infrastructure Engineer, Infrastructure & Cloud Engineer, Cloud & DevOps Engineer, nebo jiný směr?
- [ ] Co přesně zahrnuje tvrzení 7+ years? Existuje IT praxe před dubnem 2019 nebo jiné relevantní činnosti mimo `employment.json`?
- [ ] Jaké skutečné aktivity probíhaly od září 2024 do současnosti a v jakých obdobích?
- [ ] Které 2–4 pracovní výsledky si pamatuješ u každé role? Jaký byl rozsah prostředí, systémů, uživatelů nebo práce?
- [ ] Jaké technologie považuješ za Core, Working Knowledge a Familiarity?
- [ ] Je `Visual Studio` správný název, nebo jde o `Visual Studio Code`?
- [ ] Co přesně znamená `DQL (Obsidian)` v současném seznamu?
- [ ] Chceš v CV uvádět `Professional Development`, `Selected Projects` nebo `Career Break`?
- [ ] Má Google Cybersecurity Professional Certificate veřejný odkaz k ověření?
- [ ] Má být vytvořen samostatný social preview obrázek, nebo chceš používat současný profile image?

---

# Definition of Done – projekt po dokončení

- [ ] Homepage má úplná a smysluplná metadata; author ani description nejsou prázdné.
- [ ] Social preview na LinkedIn/chatu zobrazuje správný titul, popis a obrázek.
- [ ] Na stránce se nikde samovolně nezobrazuje „Course badge“.
- [ ] About má konkrétní headline a summary.
- [ ] Tvrzení o délce zkušeností je pravdivé a doložitelné.
- [ ] Employment History obsahuje stručné, výsledkově orientované body bez vymyšlených metrik.
- [ ] Období po srpnu 2024 je řešeno pravdivě a profesionálně.
- [ ] Skills mají správné kategorie, konzistentní názvy a srozumitelnou hierarchii.
- [ ] Credentials sekce mají jednoznačné názvy a správně rozdělený obsah.
- [ ] Lokální Hugo a CI používají stejnou verzi.
- [ ] GitHub Actions automaticky validuje JSON před buildem.
- [ ] CSS nemá neuzavřené komentáře ani redundantní pravidla.
- [ ] Worker implementace a README se shodují v PDF/Range behavior.
- [ ] Mobilní i desktopové zobrazení je otestované.
- [ ] PDF odkazy, lightbox, kotvy a navigace fungují.
- [ ] GitHub Actions build a Cloudflare Pages deployment skončí úspěšně.
- [ ] Dokumentace odpovídá aktuálnímu stavu repozitáře.

