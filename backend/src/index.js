import dotenv from 'dotenv'
import { app } from './app.js'
import {connectDBOne,connectDBTwo} from './db/connection.js'

dotenv.config({
    path:'./.env'
})




const startServer = async () => {
    try {
        
        await connectDBOne();
        console.log('Successfully connected to Users and Books DB');

        await connectDBTwo();
        console.log('Successfully connected to Transactions DB');
        
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error in starting the server or connecting to DB:', error);
        process.exit(1); 
    }
};

startServer();

app.on('error', (error) => {
    console.error('Error in app:', error);
});

