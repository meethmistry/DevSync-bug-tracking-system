require("dotenv").config();
const app = require('./src/app');
const connection = require('./src/config/db');
const PORT = process.env.PORT || 3003;

try  {
    connection();
    app.listen(PORT, () => {
        console.log(`User Service running on http://localhost:${PORT}`);
    })
} catch (error) {
    console.log(error);
}