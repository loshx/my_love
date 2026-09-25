# 5 luni. Noi doi. ♡

Site în română, adaptat pentru telefon și PC, cu album navigabil (butoane, swipe, taste săgeți și redare automată opțională), scrisoare și invitație. HTML, CSS și JavaScript, fără dependențe de instalat.

## Personalizare

Editează `public/config.js`: numele, scrisoarea, semnătura, amintirile, datele și locurile. Opțiunile actuale sunt exemple; înlocuiește-le înainte de publicare. Pune fotografiile în `public/photos/` și setează pentru fiecare amintire `image: '/photos/numele-pozei.jpg'`. Fără fotografie apare o ilustrație de substituție. Folosește imagini JPG/WebP comprimate, ideal sub 1 MB.

## Pe calculator

Instalează Node.js 22 sau mai nou. Rulează `npm run dev` în acest director și deschide http://localhost:3000. Nu deschide HTML-ul prin dublu clic, deoarece folosește module JavaScript. Pentru livrare locală, copiază `.env.example` în `.env` și completează variabilele. `npm test` verifică endpoint-ul fără mesaje reale.

## Răspunsurile salvate în `raspunsuri.txt`

Formularul adaugă fiecare alegere într-un fișier privat persistent din Vercel Blob. În proiectul Vercel, deschide **Storage**, creează un **Blob Store privat** și conectează-l proiectului. Vercel adaugă automat variabila `BLOB_READ_WRITE_TOKEN`. După următorul deploy, fișierul `raspunsuri.txt` apare în acel Blob Store după prima trimitere și poate fi deschis sau descărcat de acolo.

Fișierul nu se descarcă pe telefonul persoanei care completează formularul. Dacă Blob Store nu este conectat, formularul afișează o eroare și nu pretinde că răspunsul a fost salvat.

## Notificare opțională prin Telegram

Pe lângă fișierul din Vercel Blob, poți primi opțional și o notificare în Telegram, inclusiv în aplicația de pe PC.

1. Creează un bot prin contul oficial @BotFather în Telegram și păstrează tokenul primit.
2. Deschide conversația cu botul tău și trimite `/start`.
3. Folosește metoda `getUpdates` din Telegram Bot API pentru a afla `message.chat.id` pentru conversația ta.
4. În Vercel, adaugă variabilele de mediu `TELEGRAM_BOT_TOKEN` și `TELEGRAM_CHAT_ID`. Tokenul rămâne pe server; nu îl introduce în `config.js` și nu îl publica în Git.
5. Publică din nou după schimbarea variabilelor. Testează o trimitere și verifică recepția în Telegram înainte de a trimite surpriza.

Documentație: https://core.telegram.org/bots/tutorial și https://core.telegram.org/bots/api#sendmessage

Fără variabilele Telegram, salvarea în `raspunsuri.txt` continuă să funcționeze. Dacă apare o eroare de rețea, verifică fișierul înainte de retrimitere, pentru a evita dublurile.

## Vercel

Importă acest director dintr-un repository Git în Vercel. Framework Preset: **Other**, fără Build Command, Output Directory: **public**. Vercel instalează automat dependența `@vercel/blob`. `api/rsvp.js` este funcția Node.js pentru formular. Conectează Blob Store-ul, apoi fă un nou Deploy. Configurația `vercel.json` include directorul public și antete pentru a descuraja indexarea.

Documentație: https://vercel.com/docs/functions/runtimes/node-js

Pagina și fotografiile sunt accesibile oricui are linkul; `noindex` nu este o parolă. Nu publica fotografii pe care nu dorești să le faci accesibile prin link. Endpoint-ul este destinat unei invitații personale; pentru distribuție largă adaugă protecție anti-abuz persistentă.
