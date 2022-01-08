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

    public function getConnection()
    {
        return $this->connection;
    }
}
