const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const JWT_SECRET = "lab_mst_secret_key";

// Demo users
const users = [
  {
    id: 101,
    username: "admin",
    password: "admin123",
    role: "Admin",
  },
  {
    id: 102,
    username: "user",
    password: "user123",
    role: "User",
  },
];

// Home route
app.get("/", (req, res) => {
  res.send("JWT Authentication Backend is Running");
});

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) =>
      u.username === username &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    message: "Login successful",

    token,

    user: {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Protected dashboard route
app.get(
  "/api/dashboard",
  verifyToken,
  (req, res) => {
    res.json({
      message:
        "Welcome to the protected dashboard",
      userId: req.user.userId,
      role: req.user.role,
    });
  }
);

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});