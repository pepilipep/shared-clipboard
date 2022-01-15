<?php

class Db
{
    private $connection;

    public function __construct()
    {
        $dbhost = "localhost:3306";
        $dbName = "clipboard";
        $userName = "root";
        $userPassword = "1q2w3e4r";

        try {
            $this->connection = new PDO(
                "mysql:host=$dbhost;dbname=$dbName",
                $userName,
                $userPassword,
                [
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (Exception $e) {
            echo 'Something went wrong: ', $e->getMessage(), "\n";
        }
    }

    public function createUser($email, $username, $password)
    {
        $sql = $this->connection->prepare('
        INSERT INTO user(email, username, password)
        VALUES (:email, :username, :password)
        ');

        $sql->bindParam(':email', $email, PDO::PARAM_STR);
        $sql->bindParam(':username', $username, PDO::PARAM_STR);
        $sql->bindParam(':password', $password, PDO::PARAM_STR);

        $sql->execute();
    }

    public function getUser($email)
    {
        $sql = $this->connection->prepare("SELECT * FROM user WHERE email = :email");
        $sql->bindParam(':email', $email, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll();
    }

    public function getConnection()
    {
        return $this->connection;
    }

    public function createClip($url, $content_type, $content, $created_by, $expiry_time)
    {
        $sql = $this->connection->prepare("
        INSERT INTO clip(url, content, content_type, status, access_type, created_by, expiry_time)
        VALUES (:url, :content, :content_type, 'ACTIVE', 'PUBLIC', :created_by, NULL)
        ");

        $sql->bindParam(':url', $url, PDO::PARAM_STR);
        $sql->bindParam(':content', $content, PDO::PARAM_STR);
        $sql->bindParam(':content_type', $content_type, PDO::PARAM_STR);
        $sql->bindParam(':created_by', $created_by, PDO::PARAM_STR);

        $sql->execute();
    }

    public function getClip($url)
    {
        $sql = $this->connection->prepare("SELECT * FROM clip WHERE url = :url");
        $sql->bindParam(':url', $url, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll();
    }
}
