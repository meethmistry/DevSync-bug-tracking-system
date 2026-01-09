require("dotenv").config();
const app = require('./src/app');
const connection = require('./src/config/db');
const PORT = process.env.PORT || 3002;

try  {
    connection();
    app.listen(PORT, () => {
        console.log(`System Services running on http://localhost:${PORT}`);
    })
} catch (error) {
    console.log(error);
}