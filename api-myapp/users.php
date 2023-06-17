<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$koneksi = mysqli_connect("localhost", "root", "", "test_data");

$method = $_SERVER['REQUEST_METHOD'];

if($method === "GET"){
    $userId = isset($_GET['id']) ? $_GET['id'] : null;

    if($userId != 0){
        $sql = $koneksi->query("SELECT * FROM users WHERE id='$userId'");
        if($sql->num_rows > 0){
            $usersData = $sql->fetch_assoc();
            echo json_encode($usersData);
        }
    }else{
        $sql = $koneksi->query("SELECT * FROM users");
        $usersData = array();
        while($data = $sql->fetch_assoc()){
            $usersData[] = $data;
        }
        echo json_encode($usersData);
    }
}elseif($method === "POST"){
    $data = json_decode(file_get_contents('php://input'), true);

    $nama = $data['nama'];
    $username = $data['username'];
    $email = $data['email'];

    $sql = $koneksi->query("INSERT INTO users(id, nama, username, email)VALUES(null, '$nama', '$username', '$email')");
    if($sql === true){
        $userId = $koneksi->insert_id;
        $newUser = array(
            'id' => $userId,
            'nama' => $nama,
            'username' => $username,
            'email' => $email
        );
        echo json_encode($newUser);
    }
}elseif($method === "PUT"){
    $userId = isset($_GET['id']) ? $_GET['id'] : null;

    $data = json_decode(file_get_contents('php://input'), true);

    $nama = $data['nama'];
    $username = $data['username'];
    $email = $data['email'];

    $koneksi->query("UPDATE users SET nama='$nama', username='$username', email='$email' WHERE id='$userId'");
    
}elseif($method === "DELETE"){
    $userId = isset($_GET['id']) ? $_GET['id'] : null;
    $koneksi->query("DELETE FROM users WHERE id='$userId'");
}
