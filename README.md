# Wesele Magda &amp; Kuba

Statyczna strona weselna w motywie lotniczym (karta pokładowa). Bez build-stepu,
bez frameworka - czysty HTML / CSS / vanilla JS. Hostuje się na dowolnym statycznym
serwerze (GitHub Pages, Netlify, Vercel, własny nginx).

## Uruchomienie

Wystarczy otworzyć `index.html` w przeglądarce. Dla pełnej zgodności (ładowanie
`photos/`) najlepiej przez prosty serwer lokalny:

```
python -m http.server 5173
# albo
npx serve .
```

i wejść na `http://localhost:5173`.

## Pliki

- `index.html` - cała struktura strony (hero, historia, galeria, ceremonia, RSVP, stopka)
- `styles.css` - design system + wszystkie sekcje + karta pokładowa + przełącznik motywu
- `app.js` - countdown, pasek górny, zdjęcia, przełącznik motywu, formularz RSVP
- `photos/` - miejsce na zdjęcia (patrz `photos/README.md`)

## Co podmienić (placeholdery)

Wszystkie teksty w nawiasach `[ ... ]` to placeholdery do uzupełnienia:

- **Data ślubu** - stała `WEDDING_DATE` na górze `app.js` (steruje odliczaniem) oraz
  teksty `[ 06.08.2026 ]` w hero, sekcji ceremonia i stopce.
- **Miejsce** - `[ CHEŁM ]`, `[ MIEJSCE ]`, nazwy/adresy kościoła i sali w sekcji
  *Ceremonia & przyjęcie*, linki "Nawiguj" (`href`).
- **Nasza historia** - akapity i daty na osi czasu.
- **Rozkład dnia** - godziny `[ 00:00 ]`.
- **Instagram** - `[ @magda ]`, `[ @kuba ]` i `href` w stopce.
- **Zdjęcia** - wrzuć pliki do `photos/` (patrz tabela w `photos/README.md`).

## Formularz RSVP (karta pokładowa)

Wielokrokowy formularz "Potwierdź obecność" działa w całości po stronie przeglądarki:
typ (sam / w parze) → pasażerowie + obecność → menu/dieta + alergie + dzieci →
napoje + transfery → kontakt → podsumowanie z edycją → ekran "Zameldowano".

**Wysyłka jest na razie mockiem.** Po kliknięciu "Odprawa · wyślij" dane lecą do
`console.log`, a payload jest zbudowany i gotowy do POST-a. Żeby podłączyć realny
odbiór zgłoszeń, edytuj funkcję `submit()` w `app.js` (jest tam gotowy przykład
z Formspree). Payload zawiera: typ, dane obu osób (imię, obecność, dieta, alergie),
liczbę i uwagi o dzieciach, napoje, transfery, e-mail i telefon.

## Przełącznik motywu

Przycisk w prawym dolnym rogu otwiera panel zmiany kolorów (tło hero, tło karty
pokładowej, kolor akcentu, zaokrąglenie zdjęć). Wybór zapisuje się w `localStorage`.
Domyślnie: hero - szałwia, karta pokładowa - pistacja. Nie chcesz przełącznika na
produkcji? Usuń wywołanie `themeSwitcher()` w `app.js` - domyślny motyw zostaje.
