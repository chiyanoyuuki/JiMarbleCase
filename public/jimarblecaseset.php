<?php
header('Access-Control-Allow-Origin: *');

$json = file_get_contents('php://input');
$data = json_decode($json);

try
{
	$pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
	$bdd = new PDO('mysql:host=' . 'chiyanhadmin.mysql.db' . ';dbname=' . 'chiyanhadmin', 'chiyanhadmin', 'MC22e7ee3a');       
	$req = $bdd->prepare(
    "UPDATE jimarblecase 
    SET 
        `DATA` = :DATA"
	);

	$req->execute([
		'DATA' => $data->users
	]);
}
catch (Exception $e){echo "{\"ok\":false}";}
echo "{\"ok\":true}";
?>