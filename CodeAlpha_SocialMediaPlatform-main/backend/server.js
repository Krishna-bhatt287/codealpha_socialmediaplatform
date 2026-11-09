console.log("🔥 SERVER.JS IS RUNNING");

const express = require("express");
const cors = require("cors");

const connectDB = require("./db");

const User = require("./models/User");
const Post = require("./models/Post");

const app = express();

// =========================
// CONNECT DATABASE
// =========================
connectDB();

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));

// =========================
// HOME ROUTE
// =========================
app.get("/", (req, res) => {
    res.send("🎉 CodeAlpha Social Media Platform API Running");
});

// =========================
// REGISTER
// =========================
app.post("/register", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const exists = await User.findOne({ email });

        if (exists) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const user = new User({

            username,
            email,
            password,
            followers: [],
            following: []

        });

        await user.save();

        res.status(201).json({

            success: true,
            message: "Registration Successful"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

// =========================
// LOGIN
// =========================
app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,
                message: "Email and Password are required"

            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        if (user.password !== password) {

            return res.status(401).json({

                success: false,
                message: "Invalid password"

            });

        }

        return res.status(200).json({

    success:true,

    message:"Login successful",

    user:{

        _id:user._id,

        name:user.username,

        email:user.email

    }

});

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});
// =========================
// CREATE POST
// =========================
app.post("/post", async (req, res) => {

    try {

        const { userId, content } = req.body;

        if (!userId || !content) {

            return res.status(400).json({
                success: false,
                message: "User ID and content are required"
            });

        }

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const post = new Post({

            userId: user._id,
            content,
            likes: 0,
            comments: []

        });

        await post.save();

        res.status(201).json({

            success: true,
            message: "Post created successfully",
            post

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

// =========================
// GET POSTS
// =========================
app.get("/posts", async (req, res) => {

    try {

        const posts = await Post.find()
            .populate("userId", "username")
            .sort({ createdAt: -1 });

        res.json(posts);

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// =========================
// LIKE POST
// =========================
app.post("/like/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        post.likes = post.likes + 1;

        await post.save();

        res.json({

            success: true,
            message: "Post liked successfully",
            likes: post.likes

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

// =========================
// COMMENT
// =========================
app.post("/comment/:id", async (req, res) => {

    try {

        const { userId, text } = req.body;

        if (!text) {

            return res.status(400).json({

                success: false,
                message: "Comment cannot be empty"

            });

        }

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({

                success: false,
                message: "Post not found"

            });

        }

        post.comments.push({

            userId,
            text,
            createdAt: new Date()

        });

        await post.save();

        res.json({

            success: true,
            message: "Comment added successfully",
            comments: post.comments

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});
// =========================
// GET ALL USERS
// =========================
app.get("/users", async (req, res) => {

    try {

        const users = await User.find().select("-password");

        res.json(users);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// =========================
// FOLLOW USER
// =========================
app.post("/follow/:id", async (req, res) => {

    try {

        const { userId } = req.body;

        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(userId);

        if (!targetUser || !currentUser) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        if (targetUser.followers.includes(userId)) {

            return res.json({
                success: false,
                message: "Already following this user"
            });

        }

        targetUser.followers.push(userId);
        currentUser.following.push(req.params.id);

        await targetUser.save();
        await currentUser.save();

        res.json({

            success: true,
            message: "Followed successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

// =========================
// UNFOLLOW USER
// =========================
app.post("/unfollow/:id", async (req, res) => {

    try {

        const { userId } = req.body;

        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(userId);

        if (!targetUser || !currentUser) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        targetUser.followers = targetUser.followers.filter(
            id => id.toString() !== userId
        );

        currentUser.following = currentUser.following.filter(
            id => id.toString() !== req.params.id
        );

        await targetUser.save();
        await currentUser.save();

        res.json({

            success: true,
            message: "Unfollowed successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

// =========================
// USER PROFILE
// =========================
app.get("/profile/:id", async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const totalPosts = await Post.countDocuments({
            userId: user._id
        });

        res.json({

            success: true,
            user,
            totalPosts

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

// =========================
// 404 HANDLER
// =========================
app.use((req, res) => {

    res.status(404).json({

        success: false,
        message: "API Not Found"

    });

});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});