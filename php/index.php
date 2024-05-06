<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	header("Access-Control-Allow-Origin: $origin");
	header("Access-Control-Allow-Credentials: true");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
	exit;
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

define('TIMEZONE', '-5:00');
define('DB_PASS', 'SQLedg2024!');
define('DB_HOST', '212.1.208.151');
define('DB_USER', 'u184067125_edg');
define('DB_DATABASE', 'u184067125_edg');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
if($conn->connect_errno)
	die('{"response": "Error al conectar a la base de datos"}');

if(isset($_GET['action']) && $_GET['action'] == 'register'){
	$id = 0;
	$fields = [];
	$values = [];
	$data = json_decode(file_get_contents('php://input'), true);
	foreach ($data as $key => $value) {
		$type = in_array($key, ['picture', 'address']) ? 'LONGTEXT' : 'VARCHAR(50)';
		$check = $conn->query("SHOW COLUMNS FROM users LIKE '{$key}';");
		if($check->num_rows == 0)
			$conn->query("ALTER TABLE users ADD COLUMN $key $type");
		$fields[] = $key;
		$values[] = $value;
	}
	$fields = implode("`, `", $fields);
	$values = implode("', '", $values);
	$sql = "INSERT INTO `users` (`{$fields}`) VALUES ('{$values}');";
	die($sql);
	if($conn->query($sql))
		die(json_encode(['response' => 'Ok', 'id' => $id]));
}
if(isset($_GET['action']) && $_GET['action'] == 'login'){
	$data = json_decode(file_get_contents('php://input'), true);
	$sql = "SELECT id FROM `users` WHERE `email`='{$data['email']}' AND `password`='{$data['password']}';";
	$response = $conn->query($sql);
	if ($response->num_rows > 0) {
		$row = $response->fetch_assoc();
		die(json_encode(['response' => 'Ok', 'id' => $row['id']]));
	}
}
if(isset($_GET['action']) && $_GET['action'] == 'user'){
	$id = isset($_GET['data']) ? $_GET['data'] : 0;
	$sql = "SELECT * FROM `users` WHERE `id`='{$id}';";
	$response = $conn->query($sql);
	if ($response->num_rows > 0) {
		$row = $response->fetch_assoc();
		die(json_encode(['response' => 'Ok', 'data' => $row]));
	}
}