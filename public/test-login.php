<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Connect to database
    $db = new mysqli('127.0.0.1', 'root', 'kspl@1234', 'ecommercescore');
    if ($db->connect_error) {
        die(json_encode(['error' => 'Database connection failed']));
    }

    // Get user
    $stmt = $db->prepare("SELECT * FROM admin_users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Check password
        $passwordCheck = password_verify($password, $user['password']);
        
        if ($passwordCheck) {
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            echo json_encode([
                'error' => 'Invalid credentials',
                'details' => [
                    'email' => $email,
                    'password_hash' => $user['password'],
                    'password_check' => $passwordCheck
                ]
            ]);
        }
    } else {
        echo json_encode(['error' => 'User not found']);
    }
    $db->close();
    exit;
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Simple Test Login</title>
</head>
<body>
    <h1>Simple Test Login</h1>
    
    <form id="testForm" method="POST" action="">
        <div>
            <label>Email:</label>
            <input type="email" name="email" value="testadmin@test.com">
        </div>
        <div>
            <label>Password:</label>
            <input type="password" name="password" value="test1234">
        </div>
        <button type="submit">Test Login</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('testForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const response = await fetch('', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
        });
    </script>
</body>
</html>
