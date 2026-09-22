import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.static("public"));

// Temporary storage

const users = [];

// REGISTER

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: users.length + 1,

    name,

    email,

    password: hashedPassword,
  });

  res.json({
    message: "Registration successful",
  });
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Wrong password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,

      email: user.email,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "1h",
    },
  );

  res.json({
    message: "Login successful",

    token,
  });
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
