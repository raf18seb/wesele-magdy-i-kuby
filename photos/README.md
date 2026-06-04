# Zdjęcia

Wrzuć tu pliki zdjęć. Strona podstawia je automatycznie po nazwie -
dopóki pliku nie ma, w jego miejscu widać prążkowany placeholder z podpisem.

| Plik (`photos/...`) | Gdzie się pokazuje                         | Proporcje (sugestia) |
| ------------------- | ------------------------------------------ | -------------------- |
| `hero.jpg`          | Hero (duże zdjęcie pary, prawa kolumna)    | pion, ok. 3:4        |
| `historia.jpg`      | Nasza historia (zdjęcie obok tekstu)       | pion 4:5             |
| `sala.jpg`          | Ceremonia & przyjęcie (zdjęcie miejsca)    | pion / kwadrat       |
| `gal-1.jpg`         | Galeria - kafelek pionowy                  | pion                 |
| `gal-2.jpg`         | Galeria - kwadrat                          | 1:1                  |
| `gal-3.jpg`         | Galeria - panorama                         | 2:1                  |
| `gal-4.jpg`         | Galeria - kwadrat                          | 1:1                  |
| `gal-5.jpg`         | Galeria - kwadrat                          | 1:1                  |
| `gal-6.jpg`         | Galeria - panorama                         | 2:1                  |
| `gal-7.jpg`         | Galeria - kafelek pionowy                  | pion                 |
| `gal-8.jpg`         | Galeria - kwadrat                          | 1:1                  |
| `gal-9.jpg`         | Galeria - kwadrat                          | 1:1                  |
| `gal-10.jpg`        | Galeria - kwadrat                          | 1:1                  |

## Uwagi

- Nazwy/ścieżki ustawione są w `index.html` w atrybucie `data-src` każdego
  `<figure class="photo" ...>`. Chcesz inną nazwę lub format (`.png`, `.webp`)?
  Zmień `data-src`.
- Zdjęcia są wyświetlane z `object-fit: cover` (wypełniają kafelek, kadrowane
  do środka). Najlepiej wrzucać już przycięte do podanych proporcji.
- Galeria przyjmuje dowolnie wiele zdjęć - chcesz więcej kafelków, skopiuj
  `<div class="g-cell">...</div>` w sekcji `#galeria`.
