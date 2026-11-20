<?php
session_start();
function db(): PDO {
    $path = '/var/lib/lab/demo.sqlite';
    $pdo = new PDO('sqlite:' . $path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
    $count = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    if ($count === 0) {
        $stmt = $pdo->prepare('INSERT INTO users(username,password) VALUES (?,?)');
        $stmt->execute(['admin','zapdemo']);
        $stmt->execute(['student','welkom']);
    }
    return $pdo;
}
?>
