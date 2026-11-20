<?php require 'header.php'; $message='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    $name = $_POST['name'] ?? '';
    $body = $_POST['body'] ?? '';
    // Bewust zwak: alleen controleren of velden niet leeg zijn; geen sanitation/output encoding.
    if ($name != '' && $body != '') {
        $_SESSION['messages'][] = ['name'=>$name, 'body'=>$body];
        $message = 'Bericht opgeslagen.';
    } else { $message = 'Vul beide velden in.'; }
}
?>
<section class="card"><h2>Contactformulier</h2><p>Vul een naam en bericht in.</p><?php if($message): ?><p class="notice"><?php echo $message; ?></p><?php endif; ?>
<form method="post"><label for="name">Naam</label><input id="name" name="name"><label for="body">Bericht</label><textarea id="body" name="body" rows="4"></textarea><button>Versturen</button></form></section>
<section class="card"><h2>Ingezonden berichten</h2><?php foreach(($_SESSION['messages'] ?? []) as $m): ?><article><strong><?php echo $m['name']; ?></strong><p><?php echo $m['body']; ?></p></article><hr><?php endforeach; ?></section>
<?php require 'footer.php'; ?>
