# Loadtests met k6

Deze map bevat een beperkte loadtest voor de lokale PHP/Apache-demo. De test stuurt alleen GET-verzoeken naar de vier pagina's. Er worden geen formulieren verstuurd en er wordt geen data gewijzigd.

## Veiligheidslimieten

- Alleen `localhost`, `127.0.0.1` en `::1` en `web` zijn toegestaan als target.
- De test bouwt geleidelijk op tot maximaal 5 virtuele gebruikers.
- De totale testduur is 60 seconden.
- Gebruik dit script uitsluitend op de lokale oefenwebsite, niet op gedeelde of publieke omgevingen.

Een niet-lokaal adres wordt door de configuratie geweigerd. Echter, de DNS-naam `web` wordt door de andere container
via `docker compose` file in het netwerk aangemaakt en wordt daarmee ook toegestaa.

## Resultaten interpreteren

k6 toont onder meer:

- `http_req_duration`: responstijd van HTTP-verzoeken, inclusief p95.
- `http_req_failed`: aandeel HTTP-verzoeken met een foutstatus of netwerkfout.
- `checks`: percentage geslaagde controles voor HTTP 200 en HTML-responses.
- `vus`: aantal gelijktijdige virtuele gebruikers.

De thresholds zijn startwaarden voor een kleine lokale demo, geen SLA of productiebenchmark. Resultaten hangen af van hardware, Docker-configuratie en achtergrondbelasting.
