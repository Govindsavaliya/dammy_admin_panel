const router = require("express").Router();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const {
  checkAdmin,
  checkAdminLogin,
} = require("../middleware/check.admin.auth");
const {
  adminLoginRenderAction,
  adminLoginPassAction,
  adminLogoutAction,
  dashboardAction,
  clearCacheAction,
} = require("../controllers/admin/auth.controller");
require("../middleware/local.strategy");

router.use(
  session({
    name: "admin",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY_ADMIN,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Your MongoDB connection string
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      secure: false, // Set to true if you're using HTTPS
    },
  })
);
router.use(passport.initialize());
router.use(passport.session());

router.get("/login", checkAdmin, adminLoginRenderAction);
router.post(
  "/login-data",
  passport.authenticate("local", { failureRedirect: "/admin/login" }),
  adminLoginPassAction
);
router.get("/logout", adminLogoutAction);
router.get("/dashboard", checkAdminLogin, dashboardAction);
router.get("/clear-cache", clearCacheAction);

module.exports = router;
