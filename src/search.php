<?php require 'header.php'; $q = $_GET['q'] ?? ''; ?>
<section class="card">
    <h2>Zoeken</h2>
    <p>Zoek in de demo-website. Deze pagina is bewust kwetsbaar: de zoekterm wordt zonder output-encoding in de HTML geplaatst.</p>
    <form method="get">
        <label for="q">Zoekterm</label>
        <input id="q" name="q" value="<?php echo $q; ?>">
        <button type="submit">Zoeken</button>
    </form>
    <?php if (isset($_GET['q'])): ?>
        <p>Je zocht naar: <strong><?php echo $q; ?></strong></p>
    <?php endif; ?>
</section>

<section class="card">
    <h2>Zelf kwetsbaarheden uitproberen</h2>
    <p>De voorbeelden hieronder zijn bedoeld voor deze lokale oefenwebsite. Kopieer een voorbeeld naar het zoekveld en klik op <strong>Zoeken</strong>.</p>

    <h3>1. Reflected Cross-Site Scripting (XSS)</h3>
    <p>De zoekterm wordt direct in de HTML teruggeplaatst. Probeer:</p>
    <pre><code>&lt;script&gt;alert('XSS demo')&lt;/script&gt;</code></pre>
    <p>Alternatief via een HTML-eventhandler:</p>
    <pre><code>&lt;img src=x onerror=alert('XSS demo')&gt;</code></pre>
    <p><strong>Resultaat:</strong> als de browser de invoer als HTML verwerkt, verschijnt een JavaScript-alert.</p>

    <h3>2. HTML-injectie</h3>
    <p>Probeer de opmaak van de pagina te veranderen:</p>
    <pre><code>&lt;h2&gt;Deze kop komt uit mijn zoekterm&lt;/h2&gt;</code></pre>
    <p><strong>Resultaat:</strong> de tekst wordt als kop weergegeven in plaats van als gewone zoektekst.</p>

    <h3>3. Attribuut-injectie</h3>
    <p>De zoekterm wordt ook in het <code>value</code>-attribuut van het invoerveld geplaatst. Probeer:</p>
    <pre><code>" autofocus onfocus="alert('Attribuut demo')</code></pre>
    <p><strong>Resultaat:</strong> afhankelijk van de browser kan de eventhandler worden uitgevoerd wanneer het invoerveld focus krijgt.</p>

    <h3>4. URL-parameter aanpassen</h3>
    <p>De zoekterm wordt via de parameter <code>q</code> verstuurd. Pas de waarde achter <code>?q=</code> in de adresbalk aan en laad de pagina opnieuw. Bekijk in de browserontwikkelaarstools of ZAP hoe de parameter in het HTTP-verzoek staat.</p>

    <div class="notice"><strong>Let op:</strong> deze voorbeelden demonstreren invoer- en uitvoerproblemen. SQL Injection wordt op de pagina Inloggen behandeld. Test uitsluitend op deze lokale oefenwebsite.</div>
</section>
<?php require 'footer.php'; ?>
