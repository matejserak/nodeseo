SEO analýza webových stránek
============================

* autor: Matěj Šerák
* demo: [http://nodeseo.herokuapp.com](http://nodeseo.herokuapp.com)

Zadání
------

* Popište metriky, kterými lze ohodnotit webovou stránku. Diskutujte vliv těchto metrik na pozici ve výsledcích hledání (SERP - search engine results page). 
* Na základě nalezených metrik navrhněte a implementujte single-page RESTful aplikaci, která provede analýzu libovolné webové stránky zadané uživatelem. Zaměřte se na on-page i off-page faktory. 
* Výkonnou část aplikace napište v jazyce JavaScript s použitím frameworku AngularJS a platformy Node.js. Pro ukládání dat využijte libovolnou NoSQL databázi. Funkčnost kódu prověřte jednotkovými a integračními testy.
* Výstup analýzy vhodně vizualizujte a spolu s textovým výkladem prezentujte uživateli.

Instalace
---------

Následující kroky popisují zprovoznění aplikace pod operačním systémem Windows. Zprovoznění aplikace vyžaduje nainstalování platformy Node.js, databázového enginu MongoDB a WebKitu PhantomJS. Nejprve je ale zapotřebí zkopírovat zdrojové soubory z přiloženého CD kamkoliv na disk, např. do *C:\nodeseo*.

### Node.js

Instalátor Node.js je dostupný na adrese [http://nodejs.org](http://nodejs.org). Instalace je triviální a nevyžaduje žádná speciální nastavení. Po nainstalování a restartování PC je možné v konzoli používat příkaz **node** a **npm**. Zadáním příkazu **node --version** zjistíme aktuální verzi Node.js.

Pokud používaná verze neodpovídá verzi *0.8.1*, doporučuji stáhnout tuto verzi z adresy [http://nodejs.org/dist](http://nodejs.org/dist). Downgrade lze pak provést jednoduše náhradou souboru *node.exe* v místě instalace (typicky *C:\Program Files\nodejs*).

V konzoli pak zadejte v adresáři s aplikací (*cd C:\nodeseo*) příkazem **npm install** instalaci potřebných balíčků. 

### MongoDB

Databázový engine MongoDB lze stáhnout na adrese [http://www.mongodb.org/downloads](http://www.mongodb.org/downloads). V závislosti na verzi operačního systému je k dispozici 32bitová i 64bitová verze MongoDB. Stažený balíček stačí rozbalit a umístit kamkoliv na disk, např. do *C:\mongodb*. Poté vytvořte adresářovou strukturu *C:\data\db*, kam se budou ukládat data. Před každým spuštěním aplikace Nodeseo je nejprve nutné spustit MongoDB přes soubor *mongod.exe*. Při spuštění si program mongod vytvoří zámek (*C:\data\db\mongod.lock*), aby jej nebylo možné spustit dvakrát. Pokud dojde k nestandardnímu vypnutí, bude zapotřebí soubor *mongod.lock* ručně smazat, jinak nebude možné program *mongod.exe* spustit.

### PhantomJS

Instalátor PhantomJS lze stáhnout na adrese [http://phantomjs.org](http://phantomjs.org). Aplikace Nodeseo byla testována na PhantomJS ve verzi *1.8.2* a *1.9.0*. Po nainstalování je třeba přidat do systémové proměnné **PATH** cestu k aplikaci. Pod operačním systémem Windows 7 je postup následující:

1.	Klikněte pravým tlačítkem myši na *Počítač* a vyberte *Vlastnosti*.
2.	V levém sloupci zvolte *Upřesnit nastavení systému*.
3.	Na kartě *Upřesnit* klikněte na tlačítko *Proměnné prostředí*.
4.	V oblasti *Systémové proměnné* najděte proměnnou *Path* a dvojklikem na ní otevřete okno *Úpravy systémové proměnné*.
5.	Do pole *Hodnota proměnné* vložte na konec řádku za středník (;) cestu do složky s nainstalovaným WebKitem PhantomJS, např. *C:\phantomjs-1.9.0-windows*. Potvrďte změny kliknutím na tlačítko *OK*.
6.	Restartujte počítač, aby se změny projevily.

### Konfigurace

Konfigurační proměnné můžete změnit v *config/congif.json*. Připojení do databáze ponechte klidně předdefinované. Do proměnné *gmailLogin* vyplňte Vaši gmailovou adresu (např. *login@gmail.com*). Do proměnné *gmailPass* vyplňte přihlašovací heslo k gmailovému účtu. Nakonec vyplňte do proměnné *pageSpeedApiKey* API klíč, který získáte na adrese [https://code.google.com/apis/console](https://code.google.com/apis/console). Zde přejděte v levém menu na stránku *Services*, kde povolte službu *Page Speed Online API* přepnutím na *ON*. Na stránce *API Access* najdete Váš API klíč pod nadpisem *Simple API Access*.

Spuštění
--------

Aplikaci je pak možné nastartovat prostřednictvím konzole zadáním příkazu **node** na soubor *server.js*, např. tedy **node C:\nodeseo\server.js** (nezapomeňte před tím spustit *mongod.exe*). Úvodní stránka se zobrazí v prohlížeči pod adresou [http://localhost:5000](http://localhost:5000).