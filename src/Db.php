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

    public function getUserByID($id)
    {
        $sql = $this->connection->prepare("SELECT * FROM user WHERE id = :id");
        $sql->bindParam(':id', $id, PDO::PARAM_STR);
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
        VALUES (:url, :content, :content_type, 'ACTIVE', 'PUBLIC', :created_by, :expiry_time)
        ");

        $sql->bindParam(':url', $url, PDO::PARAM_STR);
        $sql->bindParam(':content', $content, PDO::PARAM_STR);
        $sql->bindParam(':content_type', $content_type, PDO::PARAM_STR);
        $sql->bindParam(':created_by', $created_by, PDO::PARAM_STR);
        $sql->bindParam(':expiry_time', $expiry_time, PDO::PARAM_STR);

        $sql->execute();
    }

    public function updateClip($url, $content_type, $content)
    {
        $sql = $this->connection->prepare("UPDATE clip SET content = :content, content_type = :content_type WHERE url = :url");

        $sql->bindParam(':url', $url, PDO::PARAM_STR);
        $sql->bindParam(':content', $content, PDO::PARAM_STR);
        $sql->bindParam(':content_type', $content_type, PDO::PARAM_STR);

        $sql->execute();
    }

    public function getClip($url)
    {
        $sql = $this->connection->prepare("SELECT * FROM clip WHERE url = :url");
        $sql->bindParam(':url', $url, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll();
    }

    public function getClipsByOwner($user_id)
    {
        $sql = $this->connection->prepare("SELECT * FROM clip WHERE created_by = :user_id");
        $sql->bindParam(':user_id', $user_id, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll();
    }

    public function getAccessedClips($user_id)
    {
        $sql = $this->connection->prepare(
            "SELECT c.url, c.content_type, max(ae.action_time) as action_time
            FROM access_event ae
            JOIN clip c ON ae.clip_id = c.id 
            WHERE ae.user_id  = :user_id
            GROUP BY c.url, c.content_type"
        );
        $sql->bindParam(':user_id', $user_id, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll();
    }

    public function getFollowedClips($user_id)
    {
        $sql = $this->connection->prepare(
            "SELECT c.url, c.content_type, s.action_time
            FROM subscription s
            JOIN clip c ON s.clip_id = c.id 
            WHERE s.user_id  = :user_id"
        );
        $sql->bindParam(':user_id', $user_id, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll();
    }

    public function getUsersFollowingClips($clip_id)
    {
        $sql = $this->connection->prepare(
            "SELECT s.user_id
            FROM subscription s 
            WHERE s.clip_id = :clip_id"
        );
        $sql->bindParam(':clip_id', $clip_id, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll();
    }

    public function insertNotification($for, $by, $clip_id)
    {
        $sql = $this->connection->prepare(
            "INSERT INTO notification(for_user, by_user, clip_id, status)
            VALUES (:for, :by, :clip_id, 'UNREAD')"
        );
        $sql->bindParam(':for', $for, PDO::PARAM_STR);
        $sql->bindParam(':by', $by, PDO::PARAM_STR);
        $sql->bindParam(':clip_id', $clip_id, PDO::PARAM_STR);
        $sql->execute();
    }

    public function getNotificationsForUser($for)
    {
        $sql = $this->connection->prepare(
            "SELECT * FROM notification
            WHERE for_user = :for AND status = 'UNREAD'"
        );
        $sql->bindParam(':for', $for, PDO::PARAM_STR);
        $sql->execute();
        return $sql->fetchAll();
    }

    public function seeNotificationsForUser($for)
    {
        $sql = $this->connection->prepare(
            "UPDATE notification
            SET status = 'UNREAD'
            WHERE for_user = :for"
        );
        $sql->bindParam(':for', $for, PDO::PARAM_STR);
        $sql->execute();
    }

    public function deleteClip($url)
    {
        $sql = $this->connection->prepare("DELETE FROM clip WHERE url = :url");
        $sql->bindParam(':url', $url, PDO::PARAM_STR);
        $sql->execute();
    }

    public function bombClip($url)
    {
        $sql = $this->connection->prepare("UPDATE clip SET expiry_time = now() WHERE url = :url");
        $sql->bindParam(':url', $url, PDO::PARAM_STR);
        $sql->execute();
    }

    public function recordAccessEvent($user_id, $clip_id)
    {
        $sql = $this->connection->prepare("INSERT INTO access_event(user_id, clip_id) VALUES (:user_id, :clip_id)");
        $sql->bindParam(':user_id', $user_id, PDO::PARAM_STR);
        $sql->bindParam(':clip_id', $clip_id, PDO::PARAM_STR);
        $sql->execute();
    }

    public function subscribe($user_id, $url)
    {
        $sql = $this->connection->prepare(
            "INSERT INTO subscription(user_id, clip_id)
            SELECT :user_id, c.id
            FROM clip c
            WHERE url = :url"
        );
        $sql->bindParam(':user_id', $user_id, PDO::PARAM_STR);
        $sql->bindParam(':url', $url, PDO::PARAM_STR);
        $sql->execute();
    }
}
