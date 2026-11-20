<?php require 'header.php'; $result='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    try {
        // Bewust kwetsbaar: gebruikersinvoer direct in SQL-query concatenated.
        $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
        $row = db()->query($sql)->fetch(PDO::FETCH_ASSOC);
        $result = $row ? 'Ingelogd als ' . $row['username'] : 'Ongeldige inloggegevens.';
    } catch (Throwable $e) { $result = 'Databasefout.'; }
}
?>
<section class="card"><h2>Inloggen</h2><form method="post"><label for="username">Gebruikersnaam</label><input id="username" name="username"><label for="password">Wachtwoord</label><input id="password" name="password" type="password"><button>Inloggen</button></form>
<?php if($result): ?><p class="notice"><?php echo $result; ?></p><?php endif; ?><p class="muted">Demo-account: admin / zapdemo</p></section>
<?php require 'footer.php'; ?>
