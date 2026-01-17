require("dotenv").config();
const app = require('./src/app');
const PORT = process.env.PORT || 4000;

try  {
    app.listen(PORT, () => {
        console.log(`Email Services running on http://localhost:${PORT}`);
    })
} catch (error) {
    console.log(error);
}