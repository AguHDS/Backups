const hasSessionOpen = (req, res, next) => {
  try {
    const token = req.cookies["authToken"];
    if (!token) {
      console.error("No authToken found");
      return res.status(401).json({ message: "No session open at logoutMiddleware" });
    }

    next();
  } catch (error) {
    console.log('error in logout middleware ', error);
    return res.status(500).json({ message: "Error trying to logout" });
  }
};

export default hasSessionOpen;
