import jwt from 'jsonwebtoken';

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token){
            const accessToken = token.split(" ")[1];
            // eslint-disable-next-line no-undef
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid!"); //403: bị ngăn cản
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("Bạn không có quyền truy cập!"); //401: chưa được xác thực
        }
    },
    verifyTokenAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.isAdmin) {
                next();
            } else {
                return res.status(403).json("Bạn không có quyền truy cập!");
            }
        });
    }
}
export default middlewareController;