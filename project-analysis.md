# Project Analysis – Personal Resume Website

**Datum auditu:** 20. listopadu 2026  
**Projekt:** [ixchelone/resume](https://github.com/ixchelone/resume)  
**Produkční adresa:** <https://ixchelone.dev/>  
**Auditovaný branch:** `main`  
**Auditovaný commit:** `0ea805ae5f6d3337362626e9b3b98e8b398c0b1b` – `docs(content): update English proficiency level`

Související pracovní plán je v [`TODO.md`](./TODO.md).

---

## 1. Executive summary

Projekt má dobrou technickou základnu. Je postavený na Hugo, používá vlastní layouty a shortcody nad theme spravovaným jako Git submodule, data CV ukládá do samostatných JSON souborů a automaticky nasazuje přes GitHub Actions na Cloudflare Pages. PDF dokumenty jsou uložené v GitHub Releases a zpřístupněné pod vlastní doménou prostřednictvím Cloudflare Pages Workeru.

Základní architekturu není potřeba přepisovat. Nedávné oddělení About do headless page bundle a vykreslení samostatných sekcí jako sourozeneckých elementů je správný směr. Také společný styl oddělovačů a horizontálního odsazení jednotlivých sekcí je vhodnější než duplikování pravidel v každém shortcodu.

Největší současné slabiny jsou v profesní prezentaci CV:

1. **Employment History je převážně seznam úkolů a technologií.** U většiny bodů není patrný rozsah práce, její výsledek ani přínos.
2. **Professional Summary je příliš obecný.** Některé formulace zabírají místo, ale neříkají, na jaké problémy a role se kandidátka specializuje.
3. **Tvrzení „7+ years of IT experience“ není podloženo pouze daty v `employment.json`.** Uvedená zaměstnání dohromady představují 63 měsíců, tedy 5 let a 3 měsíce. Je nutné ověřit, zda existují další relevantní zkušenosti.
4. **Období po srpnu 2024 není v Employment History zachyceno.** K 20. listopadu 2026 jde přibližně o 2 roky a 3 měsíce bez uvedené pracovní aktivity.
5. **Technical Skills nemají vyjádřenou hierarchii a některé položky jsou v nevhodných kategoriích.**
6. **Metadata homepage obsahují prázdný description a prázdného autora.** Open Graph description je také prázdný.
7. **Lightbox obsahuje obrázek bez `src`, ale s alternativním textem „Course badge“.** Je nutné ověřit a opravit jeho počáteční stav.

Kromě bodů z Claudeova feedbacku audit odhalil další technické nesrovnalosti: neuzavřený CSS komentář, duplicitní CSS pravidlo, rozdíl lokální a CI verze Huga a rozpor mezi dokumentací PDF Workeru a jeho aktuálním předáváním HTTP hlaviček.

**Doporučené pořadí:** rychlé technické opravy a metadata → ověření profesního zaměření a délky zkušeností → Employment History → období po srpnu 2024 → Summary → Skills a Credentials → CI/Worker a dlouhodobá údržba frontendových knihoven.

---

## 2. Rozsah auditu a spolehlivost podkladů

### 2.1 Zkontrolované zdroje

- Dodaný archiv projektu `resume.tar(1).gz`.
- Aktuální veřejný repozitář [`ixchelone/resume`](https://github.com/ixchelone/resume), branch `main`.
- Konfigurace Hugo, homepage layout, About partial, shortcody a JSON data.
- CSS, JavaScript, Cloudflare Worker a GitHub Actions workflow.
- README a Cloudflare README.
- Přibalená vygenerovaná složka `public/`.
- Poskytnutý Claude feedback a předchozí výsledky testování / screenshoty z této konverzace.

### 2.2 Stav repozitáře při auditu

- Archivovaný Git working tree byl čistý.
- `main` a `origin/main` v archivu ukazovaly na commit `0ea805a`.
- GitHub repository je veřejný a jako default branch používá `main`.
- GitHub Actions run pro auditovaný commit `0ea805a` byl dokončen se stavem `success`: [workflow run 44329904301](https://github.com/ixchelone/resume/actions/runs/44329904301).
- Theme `eddiewebb/hugo-resume` je připojený jako Git submodule v `themes/resume/`.

### 2.3 Omezení kontroly produkčního webu

Přímé načtení `https://ixchelone.dev/` se v auditním prostředí nepodařilo: nástroj webového načítání vrátil cache miss a systémový HTTP test nedokázal vyřešit DNS jméno. Proto zde **netvrdím, že jsem osobně ověřil aktuální vykreslení živé stránky, její social preview nebo chování v prohlížečích**.

Aktuální GitHub Actions deployment pro auditovaný commit ale skončil úspěšně. To potvrzuje úspěšný build a deploy workflow, nikoli samo o sobě správné vykreslení všech prvků v produkčním browseru.

### 2.4 Zastaralý `public/` v archivu

Složka `public/` je v `.gitignore`, ale je součástí dodaného archivu. Obsahuje starší vygenerovaný web a nesmí být považována za aktuální zdroj pravdy.

Příklady rozdílů mezi aktuálním zdrojovým kódem a archivním výstupem:

| Oblast | Aktuální zdrojový kód | Archivní `public/index.html` |
|---|---|---|
| IT experience | `7+ years` v `content/about/index.md` | `6+ years` |
| English | `C1 (advanced)` | `C1/C2 (advanced)` |
| Ambis study | `Bachelor's (terminated)` | `Bachelor's (paused)` |
| Cloudflare ve skills | Přítomno | V archivním buildu chybí |
| Hugo generator | CI je připnuté na 0.141.0 | Archivní HTML uvádí 0.123.7 |

`public/` se proto musí před vizuální kontrolou lokálně znovu vygenerovat stejnou verzí Huga, jakou používá CI.

---

## 3. Architektura projektu

### 3.1 Technologický stack

| Vrstva | Použití |
|---|---|
| Static site generator | Hugo Extended |
| Theme | Hugo Resume by Eddie Webb, Git submodule |
| Content | Hugo Markdown / HTML a headless About page bundle |
| Structured data | JSON soubory v `data/` |
| Templates | Vlastní Hugo layouts, partials a shortcodes |
| Styling | Vlastní CSS, Bootstrap 4.5.3, self-hosted fonty |
| JavaScript | Vlastní JS a jQuery 3.6.4 Slim + Bootstrap bundle 4.5.3 |
| CI/CD | GitHub Actions |
| Hosting | Cloudflare Pages |
| PDF storage | GitHub Releases, release `credentials` |
| PDF delivery | Cloudflare Pages Worker |
| Domain / DNS | `ixchelone.dev`, Cloudflare DNS, Porkbun jako registrar dle README |

### 3.2 Důležité adresáře a soubory

| Cesta | Role |
|---|---|
| `config.toml` | Základní Hugo konfigurace, brand, barvy, PDF URL a profilový obrázek |
| `content/about/index.md` | Text úvodního profilu About; headless page bundle |
| `content/_index.md` | Homepage content a pořadí shortcodů jednotlivých sekcí |
| `layouts/index.html` | Sestavení homepage: About partial a zbytek homepage contentu jako samostatné sourozenecké sekce |
| `layouts/_default/baseof.html` | Sdílená HTML struktura, metadata, CSS bundle, JavaScript a badge lightbox |
| `layouts/partials/about.html` | Prezentační About partial, kontakt, QR, sociální profily a obsah předané Page contextem |
| `layouts/partials/nav.html` | Navigace, kotvy sekcí a odkaz na PDF CV |
| `layouts/shortcodes/*.html` | Vykreslení jazyků, skills, zaměstnání, vzdělání a credentials |
| `data/employment.json` | Pracovní pozice, summary a highlights |
| `data/skills.json` | Kategorie a seznam technologií |
| `data/languages.json` | Jazyky a CEFR popisy |
| `data/education.json` | Vzdělání |
| `data/certifications.json` | Profesní certifikace |
| `data/certificates.json` | Certifikáty a dokončené programy |
| `data/courses.json` | Kurzy a webináře |
| `assets/css/` | CSS, font declarations, overrides a vendor Bootstrap CSS |
| `static/js/site/` | Vlastní navigace, scrollspy a PDF link skripty |
| `static/js/vendor/` | Vendor jQuery a Bootstrap JavaScript |
| `cloudflare/_worker.js` | PDF proxy a fallback na statické Pages assets |
| `.github/workflows/hugo.yaml` | Build a deployment do Cloudflare Pages |

### 3.3 Hodnocení architektury

**Silné stránky**

- Zdrojová data jsou oddělena od prezentačních šablon.
- Theme se neupravuje přímo; vlastní změny jsou v `layouts/` a `assets/`.
- About má vlastní headless content bundle, takže plaintext není natvrdo vložený do prezentační šablony.
- Jednotlivé homepage sekce jsou samostatné elementy a mají konzistentní oddělovače.
- CSS se skládá, minifikuje a fingerprintuje pomocí Hugo Pipes.
- Fonty, CSS a JS jsou self-hosted; nepoužívají se externí CSS/JS CDN.
- CI má připnutou verzi Huga a při nasazení zahrnuje submodules.
- PDF soubory lze vyměnit v GitHub Release bez změny Hugo dat, pokud zůstane stejný název souboru.
- Worker omezuje metody PDF endpointu na GET a HEAD a validuje názvy souborů.

**Co zachovat**

- Headless About content bundle.
- Rozdělení JSON dat a shortcodů.
- Vlastní theme overrides namísto přímých editací submodule.
- Jednotný styl sekcí a oddělovačů.
- CI deploy do Cloudflare Pages.

---

## 4. Detailní audit Claude feedbacku

### 4.1 Metadata, author a Open Graph

**Stav: potvrzený problém ve zdrojovém kódu.**

V `config.toml` v `[params]` je `brandName = "Ilona Ixchel Loučka"`, ale chybí `description`, `author`, `firstName` a `lastName`.

`layouts/_default/baseof.html` vytváří:

- `<title>` z `.Site.Title` a `.Title` – vyplněno;
- `meta description` z `.Site.Params.description` na homepage – prázdné, protože parametr není nastaven;
- `og:title` – vyplněno;
- `og:image` z `profileImage` – vyplněno;
- `og:description` z `.Site.Params.description` – prázdné;
- `meta author` z `.Site.Params.firstName` a `.Site.Params.lastName` – výsledkem je prázdná hodnota.

V archivním HTML bylo skutečně vidět `meta name=author content=" "` a prázdné description hodnoty.

**Pozor na návrh přidat `firstName` a `lastName`:** About partial používá tyto parametry také pro zobrazení kontaktní hlavičky. Jeho `$showHeader` se stane true, pokud je vyplněné jméno, příjmení, adresa, e-mail nebo `showQr`. Prosté doplnění jména by tedy mohlo způsobit duplicitní hlavičku, protože jméno a titul již obsahuje `content/about/index.md`.

**Doporučené řešení**

- Použít `brandName` jako author fallback, případně přidat samostatný `author` parametr.
- Přidat kvalitní `description` v `[params]`.
- Upravit metadata tak, aby měly fallback a nevyráběly prázdné hodnoty ani na jiných stránkách.
- Doplnit `og:url`, `og:type`, `og:site_name` a případně `og:image:alt`.
- Doplnit Twitter Card metadata (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
- Zvážit canonical URL.
- Zvážit samostatný social preview obrázek místo profilového symbolu. `static/images/inguz.png` má rozměr 512 × 512 px; pro široký social preview je vhodnější dedikovaný banner. Je třeba ověřit veřejnou dostupnost a skutečné vykreslení náhledu.
- Otestovat metadata pomocí LinkedIn Post Inspector a případně dalších social sharing debuggerů.

**Nedělat:** nepřidávat `firstName` a `lastName` bez oddělení metadat od logiky zobrazení About headeru.

### 4.2 „Course badge“ text a lightbox

**Stav: problémová konstrukce potvrzena; viditelnost na aktuálním live webu nebyla přímo ověřena.**

V `baseof.html` je:

```html
<img id="badge-image" alt="Course badge">
```

Element nemá `src`. V lightbox JavaScriptu se `src` nastavuje až po úspěšném načtení předobrazu. Lightbox CSS má počáteční `visibility: hidden`, ale uživatelský feedback hlásí zobrazený text „Course badge“ na konci stránky. Proto je nutné ověřit počáteční DOM a skutečné chování po novém buildu.

**Doporučené řešení**

- Obrázek explicitně skrýt až do okamžiku úspěšného načtení (`hidden` nebo vlastní třída s `display: none !important`).
- Při otevření lightboxu odstranit skrytí až po načtení obrázku.
- Při zavření skrýt obrázek a odstranit jeho `src`.
- Zachovat smysluplný `alt` text.
- Otestovat, že text/rozbitý obrázek není vidět při běžném načtení stránky, při chybě načítání obrázku ani po zavření lightboxu.

Relevantní zdroj: `layouts/_default/baseof.html`, blok Badge Lightbox; CSS v `assets/css/resume-override.css`.

### 4.3 Employment History a impact bullets

**Stav: obsahová slabina potvrzena.**

`data/employment.json` obsahuje pět pracovních pozic a celkem 37 highlightů. Jejich současné počty:

| Role | Období | Počet bodů |
|---|---|---:|
| Infrastructure Engineer – Zentity | 2023-09 až 2024-08 | 8 |
| Application Administrator & Solution Manager Deputy – T-Mobile | 2022-05 až 2023-08 | 8 |
| Technical Support Engineer (Customer Success) – Chyron | 2020-12 až 2022-04 | 9 |
| OpsTech IT Engineer – Amazon | 2020-07 až 2020-09 | 5 |
| Network Engineer – NTT | 2019-04 až 2020-06 | 7 |

Většina bodů popisuje aktivitu, nástroj nebo technologii, nikoli měřitelný výsledek. Jediný výraznější kvantifikovaný údaj je `Monitored 40+ servers via Zabbix and Grafana.` u Chyron.

Příklady současného stylu:

- „Created and customized Zabbix dashboards for proactive monitoring.“
- „Developed Python and Bash automation scripts with cron scheduling.“
- „Managed patches, configurations, and updates on Linux and Oracle SQL DBs.“
- „Streamlined ITSM workflows in HP Service Manager; maintained external KB.“

Doporučený vzorec:

> Action + Context / Scope + Outcome / Impact

Čísla používat pouze tehdy, pokud je lze doložit nebo poctivě odhadnout. Pokud konkrétní metriku neznáme, může být dopad popsán kvalitativně. Nevymýšlet snížení času, procenta, počty serverů ani nulové výpadky.

**Doporučený výsledný rozsah:** 2–4 nejsilnější body na pozici; starší nebo méně relevantní role mohou mít méně bodů. Zachovat nejdůležitější technologie, ale neproměnit každou odrážku v prostý seznam nástrojů.

Podrobné otázky pro jednotlivé pracovní pozice jsou v `TODO.md`.

### 4.4 Professional Summary a headline

**Stav: obsahová slabina potvrzena.**

Současný headline je `IT Consultant`.

Současný summary obsahuje obecné fráze:

- „broad technical skill set“;
- „take initiative to maintain momentum“;
- „keep communication plain and actionable“;
- „ranging from operations to DevOps and cloud exposure“.

Tyto věty mají nízkou informační hodnotu a neukazují dostatečně jasně cílové technické zaměření.

**Možné varianty headline**

1. `Infrastructure & Cloud Engineer` – široká a konkrétní varianta, pravděpodobně nejvyváženější.
2. `IT Infrastructure Engineer` – konzervativnější varianta nejlépe odpovídající doloženým pracovním pozicím.
3. `Cloud & DevOps Engineer` – vhodné pro cílené DevOps/cloud role, ale je nutné silněji doložit reálné cloudové a CI/CD výsledky.

Headline musí odpovídat skutečně hledaným pracovním pozicím a doloženým zkušenostem.

**Summary by měl obsahovat:**

- jasné profesní zaměření;
- ověřenou délku zkušeností;
- hlavní technické oblasti (např. Linux/Windows, infrastruktura, cloud, monitoring, containerized environments, automatizace);
- typ prostředí a odpovědností, ve kterých má kandidátka praxi;
- případně specifický přínos, který se opakuje napříč rolemi.

Neměl by obsahovat neurčité self-descriptive fráze, které nejdou ověřit konkrétní prací.

### 4.5 Ověření „7+ years of IT experience“

**Stav: nesoulad mezi tvrzením a daty v Employment History; nutné doplnit informace.**

Součet intervalů v `employment.json` při počítání včetně počátečního a koncového měsíce:

| Zaměstnavatel | Délka podle měsíců |
|---|---:|
| NTT | 15 měsíců |
| Amazon | 3 měsíce |
| Chyron | 17 měsíců |
| T-Mobile | 16 měsíců |
| Zentity | 12 měsíců |
| **Celkem** | **63 měsíců = 5 let a 3 měsíce** |

Časová osa od dubna 2019 do srpna 2024 zahrnuje 65 kalendářních měsíců. Dva měsíce (2020-10 až 2020-11) nejsou v současném Employment History pokryté zaměstnáním.

Tento výpočet **neprokazuje, že 7+ years je nesprávně**. Prokazuje pouze, že jej nelze odvodit z aktuálně uvedených pracovních pozic. Může existovat další relevantní praxe před dubnem 2019, samostatné projekty, freelance nebo jiné IT aktivity, které v `employment.json` nejsou.

**Nutný krok:** vyjasnit, co přesně se do 7+ let započítává. Pokud další relevantní zkušenost neexistuje, upravit tvrzení podle pravdivých údajů; nepřizpůsobovat data marketingovému tvrzení.

### 4.6 Employment gap po srpnu 2024

**Stav: mezera v publikované pracovní časové ose potvrzena.**

Poslední uvedená pracovní pozice končí 31. srpna 2024. K 20. listopadu 2026 je období bez uvedené následné role přibližně 2 roky a 3 měsíce.

Možnosti:

1. **Professional Development & Projects** – uvést skutečné projekty, samostudium, certifikace a relevantní technickou práci, s konkrétními daty a popisem.
2. **Career Break** – pokud je to žádoucí, uvést neutrální záznam bez zveřejňování osobních důvodů.
3. **Kombinace** – projekty a odborný rozvoj zobrazit odděleně a mezeru případně stručně vysvětlit.

Nesmí se vytvářet fiktivní zaměstnání ani prezentovat osobní projekt jako komerční zaměstnání.

**Doložený kandidátský projekt:** vlastní CV web v tomto repozitáři. Reálně doložené technologie a činnosti zahrnují Hugo, Markdown/JSON content, GitHub Actions, Cloudflare Pages, Cloudflare Worker, CSS/JavaScript a publikaci PDF dokumentů z GitHub Releases. Projekt může být zařazen do `Selected Projects` / `Personal Projects`, pokud doplníme skutečné datum a ověříme, že jeho časový rozsah odpovídá tomu, co chceme prezentovat. Nemá automaticky zakrývat celou dobu mezery.

### 4.7 Technical Skills – kategorizace a úrovně

**Stav: problémy potvrzeny.**

`data/skills.json` obsahuje 12 kategorií a 58 položek. Současný shortcode je zobrazuje vizuálně stejně; data neobsahují proficiency levels.

Konkrétní položky k přezkoumání:

| Položka | Aktuální kategorie | Doporučení / otázka |
|---|---|---|
| Postman | Security | Přesunout do API & Testing / API Tools. |
| Visual Studio | Version Control | Ověřit, zda jde o Visual Studio nebo VS Code; případně Developer Tools. |
| Git | Version Control | Ponechat. |
| nginx | Networking | Zvážit Web Servers / Reverse Proxies. |
| Apache | Networking | Zvážit Web Servers / Reverse Proxies. |
| VMware ESXi Hyper-V | Cloud Computing | Rozdělit na samostatné položky; ověřit kategorii. |
| CCNA-level concepts | Networking | Nahradit konkrétními znalostmi, nebo vypustit. |
| DQL (Obsidian) | Database | Ověřit přesnou technologii/název a zda je relevantní pro cílové role. |
| AI-assisted coding | Scripting & Automation | Zvážit ponechání jako doplňkovou dovednost, ne core. |
| Prompt engineering | Scripting & Automation | Posoudit relevanci a doložitelnost. |

Možná koncepce úrovní:

- **Core Competencies** – silné, prakticky využívané kompetence relevantní pro cílové role.
- **Working Knowledge** – technologie používané v praxi, ale ne hlavní specializace.
- **Familiarity** – základní nebo omezená praktická zkušenost.

Nedoporučují se procentní progress bary nebo arbitrární procenta znalosti. Pokud se úrovně zavedou, musí být samostatně a upřímně zhodnoceny pro každou technologii. Je třeba nejprve rozhodnout datový model a až poté upravit JSON a shortcode.

### 4.8 Credentials: Certifications vs. Certificates vs. Courses

**Stav: terminologická nejednoznačnost; sloučení není nutné.**

Aktuální data:

| Soubor / nadpis | Počet položek | Obsah |
|---|---:|---|
| `certifications.json` / Certifications | 3 | ITIL 4 Foundation, ITIL 4 Practitioner, PRINCE2 Agile Expert |
| `certificates.json` / Certificates | 4 | CyberEdu NIS2 Academy, Google Cybersecurity Professional, Offensive Security Crash Course, Productizing Customer Programs |
| `courses.json` / Courses | 8 | PeopleCert webináře a Codecademy kurzy |

Tyto skupiny mají odlišný význam. Doporučení je zachovat tři skupiny, ale zpřesnit nadpisy:

- `Professional Certifications`
- `Training & Program Certificates`
- `Courses & Webinars`

Při změně textových nadpisů zachovat existující anchor IDs (`certifications`, `certificates`, `courses`), pokud se nemění navigace/odkazování.

Dále ověřit:

- zda `Google Cybersecurity Professional` má veřejný ověřovací odkaz, protože současná položka jej nemá;
- zda názvy, issuer a subtitles odpovídají oficiálním názvům;
- zda datum a expirace PeopleCert odpovídají certifikátům;
- zda se webináře a kratší kurzy skutečně hodí do stejné úrovně důležitosti jako formální kurzy.

### 4.9 Starší frontendové knihovny

**Stav: potvrzeno ve zdrojovém projektu; plánovaná údržba, ne akutní funkční chyba.**

Projekt používá:

- Bootstrap CSS 4.5.3;
- Bootstrap bundle JS 4.5.3;
- jQuery Slim 3.6.4.

Navigace používá Bootstrap 4 data attributes (`data-toggle`, `data-target`) a vlastní jQuery skripty používají Bootstrap 4 API (`collapse`, `scrollspy`). Přechod na Bootstrap 5 proto není pouhá výměna vendor souborů.

Doporučený postup:

1. Inventarizovat Bootstrap/jQuery závislosti v HTML a JS.
2. Rozhodnout o Bootstrap 5 a odstranění jQuery.
3. Převést navbar collapse a scrollspy na kompatibilní Bootstrap 5 API nebo vhodné vanilla JS řešení.
4. Ověřit mobilní menu, scrollspy, kotvy, PDF link a lightbox.
5. Až potom odstranit staré vendor soubory.

Neprovádět bez regresního testování, protože navigace a scrollování byly v minulosti zdrojem problémů.

---

## 5. Další technické nálezy

### 5.1 CSS komentář blokuje intro styly

**Stav: chyba potvrzena ve zdrojovém CSS.**

V `assets/css/resume-override.css` začíná na řádku 94 komentář `/* Intro heading`, který není uzavřen před `.intro-title`. Další `/* Intro subheading...` je proto vnořen do komentáře a první následující `*/` (u `remove ALL CAPS`) uzavírá původní komentář. Výsledkem je, že deklarace pro `.intro-title` a část `.intro-subtitle` nejsou správně parsovány.

Opravit komentář tak, aby každý CSS komentář měl vlastní `*/` a oba intro selektory byly aktivní. Potom provést build a vizuální kontrolu nadpisu About.

### 5.2 Duplicitní CSS pravidlo pro desktop padding

V `resume-override.css` jsou dva totožné `@media (min-width: 992px)` bloky pro `padding-left/right: 3rem` u `section.resume-section`. Sloučit je do jednoho bloku, aby CSS nemělo redundantní pravidla.

### 5.3 Potenciálně nepoužívané pravidlo `hr.m-0`

CSS stále definuje `hr.m-0`, ale ruční `<hr>` byly odstraněny z hlavních shortcode souborů. Před odstraněním ověřit, zda se `hr.m-0` nepoužívá jinde (theme, content nebo jiné stránky). Pokud ne, odstranit nevyužité pravidlo.

### 5.4 PDF Worker a HTTP Range requests – rozpor k ověření

**Stav: nesoulad mezi README a implementací potvrzen; produkční dopad je nutné ověřit.**

Hlavní README tvrdí, že PDF endpoint podporuje byte-range requests a že bylo produkčně ověřeno `206 Partial Content`, `Content-Range` a `Content-Length`.

Aktuální `cloudflare/_worker.js` ale volá upstream takto:

```javascript
const upstream = await fetch(gh, {
  method: request.method,
  headers: { 'User-Agent': 'cf-proxy' },
});
```

Příchozí `Range` ani `If-Range` se v tomto kódu nepředávají do GitHub Release requestu. Proto je nutné ověřit, zda současná implementace skutečně vrací částečný obsah; dokumentace a viditelný kód nejsou konzistentní.

Doporučený test:

- zavolat PDF URL s `Range: bytes=0-1023`;
- ověřit status `206 Partial Content`;
- ověřit `Content-Range`, `Content-Length` a `Accept-Ranges`;
- porovnat chování GET a HEAD;
- test zopakovat na produkční URL po případné úpravě Workeru.

Pokud je Range podpora žádoucí, předat pouze potřebné hlavičky (`Range`, `If-Range`) při zachování User-Agent a metody. Pokud není nutná nebo nefunguje v produkci, opravit README, aby netvrdilo neověřenou funkcionalitu.

### 5.5 Hugo verze lokálně a v CI

**Stav: nesoulad potvrzen historickým terminálovým výstupem a CI konfigurací.**

- Lokální prostředí vykázalo Hugo Extended `0.123.7`.
- `.github/workflows/hugo.yaml` používá `HUGO_VERSION: 0.141.0`.
- Archivní `public/index.html` uvádí generator 0.123.7.

Pro reprodukovatelné výsledky používat lokálně stejnou verzi Extended Huga jako CI. Ověřit také verzi na stroji při navazujícím vývoji.

### 5.6 Chybějící validace JSON v CI

V `data/` je 7 JSON souborů. Při auditu byly všechny syntakticky validní. Workflow ale před Hugo buildem nemá samostatný krok `jq empty` nebo ekvivalentní validaci.

Přidat JSON syntax check pro všechny `data/*.json`. Jako druhou fázi zvážit jednoduché kontroly očekávaných polí a typů, zejména u `employment.json`, `skills.json` a credentials.

### 5.7 README a implementace

README je užitečné a poměrně detailní. Přesto je třeba průběžně udržovat soulad s implementací:

- Range requests tvrzení u PDF Workeru;
- seznam sekcí / „selected work“, pokud na webu není aktuálně odpovídající Projects sekce;
- verze a funkce vendor knihoven;
- data a názvy Credentials;
- instrukce k lokálnímu buildu a verzi Hugo.

README měnit až po ověření skutečného chování; ne podle předpokladu.

### 5.8 Menší možné sjednocení metadata / HTML

- `config.toml` nastavuje `languageCode = "en-us"`, ale `baseof.html` má pevné `<html lang="en">`. Není to zásadní chyba; lze sjednotit generování jazyka s Hugo konfigurací.
- `og:image` nyní používá profilový obrázek `static/images/inguz.png` (512 × 512). Ověřit, zda je vhodný pro široké social preview; zvážit samostatný banner.
- U non-home stránek může `.Description` chybět. Metadata template má mít rozumný fallback místo prázdného content atributu.

---

## 6. Stav CI/CD a deploymentu

Workflow `.github/workflows/hugo.yaml`:

1. Spouští se při relevantních změnách na `main` nebo ručně.
2. Má samostatný job pro zjištění změn.
3. Checkoutuje repo včetně submodules.
4. Instaluje Hugo Extended 0.141.0.
5. Obnovuje a ukládá cache.
6. Generuje web do `public/` s `--gc --minify --enableGitInfo`.
7. Přidává `cloudflare/_worker.js` do `public/_worker.js`.
8. Nasazuje přes `cloudflare/wrangler-action@v4` na Pages projekt `ixchelone`.

**Pozitivní:** auditovaný HEAD má úspěšný GitHub Actions deployment. Workflow má concurrency group, která ruší starší běžící deploy při novém pushi.

**Doporučená vylepšení:**

- přidat JSON validaci před build;
- sjednotit lokální verzi Huga s CI;
- zvážit HTML/CSS lint nebo alespoň automatické kontroly kritických markerů;
- udržovat action dependencies a případně později pinovat action SHA jako supply-chain hardening;
- zkontrolovat, zda změny konfiguračních/deployment souborů, které mají spouštět deploy, odpovídají `paths` filtru.

---

## 7. Doporučený profesní positioning

Při současných doložených pozicích a technologických oblastech se jako nejvyváženější headline jeví:

**Infrastructure & Cloud Engineer**

Alternativy:

- `IT Infrastructure Engineer` – konzervativnější a nejblíže doloženým názvům pozic;
- `Cloud & DevOps Engineer` – vhodné pro cílené DevOps role, ale vyžaduje dostatečně konkrétní doklady cloud/CI/CD zkušeností.

Nejprve je třeba rozhodnout, na jaké pracovní nabídky má být CV primárně cíleno. Jedna obecná verze může zůstat, ale headline, Summary a pořadí Skills by měly odpovídat cílovému směru.

### 7.1 Návrh struktury Summary

1. Kdo jsi profesně a na jaké oblasti se zaměřuješ.
2. Jaké prostředí a typy systémů jsi podporovala.
3. Jaké konkrétní kompetence používáš (troubleshooting, monitoring, administration, automation, cloud/container deployment apod.).
4. Jaký druh provozního / technického přínosu přinášíš.

Přesný text vypracovat až po vyjasnění délky zkušeností, hlavního zaměření a dopadů z pracovních rolí.

---

## 8. Doporučená implementační strategie

### Fáze 1 – Rychlé opravy a základní technická spolehlivost

- Metadata a social preview.
- Course badge / lightbox.
- CSS komentář a duplicitní pravidlo.
- Hugo verze a JSON validace v CI.

### Fáze 2 – Profesní identita

- Rozhodnout headline a cílové role.
- Ověřit tvrzení 7+ years.
- Přepsat Summary.

### Fáze 3 – Employment History

- Shromáždit reálné výsledky a rozsah práce pro každého zaměstnavatele.
- Vybrat 2–4 nejhodnotnější body na roli.
- Přepsat `employment.json`.

### Fáze 4 – Období po srpnu 2024

- Sepsat skutečné technické projekty, školení, studium a aktivity.
- Rozhodnout, zda a jak použít Projects / Professional Development / Career Break.
- Nevydávat osobní projekty za zaměstnání.

### Fáze 5 – Skills a Credentials

- Opravit kategorizaci a nejasné položky.
- Zvolit jednoduchou úroveň kompetencí.
- Zpřesnit nadpisy Credentials.

### Fáze 6 – Dlouhodobá údržba a finální QA

- Worker Range test / dokumentace.
- Plán migrace Bootstrap 4 → 5 a odstranění jQuery.
- Desktop/mobile, SEO/social preview, keyboard/lightbox, PDF a anchor testy.

---

## 9. Co musí zůstat pravdivé a ověřitelné

- Nevymýšlet výsledky, procenta, počty systémů, SLA ani úspory času.
- Neprezentovat osobní projekt jako pracovní poměr.
- Neuvádět `7+ years`, dokud nejsou doloženy všechny započítané zkušenosti.
- Neuvádět proficiency levels bez realistického sebehodnocení.
- Nezvyšovat počet kategorií skills jen kvůli vzhledu; prioritou je srozumitelnost.
- Neměnit historii vzdělání nebo credentials bez ověření správného významu.
- Nepovažovat úspěšný GitHub Actions build za náhradu vizuální kontroly živého webu.

---

## 10. Odkazy

- [Live website](https://ixchelone.dev/)
- [GitHub repository](https://github.com/ixchelone/resume)
- [Latest audited commit](https://github.com/ixchelone/resume/commit/0ea805ae5f6d3337362626e9b3b98e8b398c0b1b)
- [Latest audited successful deployment](https://github.com/ixchelone/resume/actions/runs/44329904301)
- [Main Hugo workflow](https://github.com/ixchelone/resume/blob/main/.github/workflows/hugo.yaml)
- [Main README](https://github.com/ixchelone/resume/blob/main/README.md)
- [Cloudflare Worker README](https://github.com/ixchelone/resume/blob/main/cloudflare/README.md)
- [Detailed implementation checklist](./TODO.md)

