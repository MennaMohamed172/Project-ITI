// import jwt from "jsonwebtoken";
// export const auth = (req, res, next) => {
//   let { token } = req.headers;
//   jwt.verify(token, "ITI", (err, decoded) => {
//     if (err) return res.json({ message: "token err", err });
//     req.userID = decoded.id;
//     next();
//   });
// };

export const authenticateToken=(req, res, next) =>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }
  
  jwt.verify(token, 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
}