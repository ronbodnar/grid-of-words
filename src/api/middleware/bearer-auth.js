// Just some bs auth to stop people from potentially accessing the API in the browser until I do full auth
export const checkBearer = (req, res, next) => {
    const apiKey = req.get('Authorization');
    if (!apiKey || apiKey !== 'Bearer ' + process.env.BEARER_TOKEN) {
      res.json({ message: "WHO ARE YOU?" });
      return;
    }
    next();
}