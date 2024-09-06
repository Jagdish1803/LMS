import { app } from "./app";
import connectDB from "./utils/db";
require ("dotenv").config();
//server
app.listen(8000, () => {
    console.log(`server is connected with port ${8000}`);
    connectDB();

});