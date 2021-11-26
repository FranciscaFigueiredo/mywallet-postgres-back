import './setup.js';
import { app } from './app.js';

app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${process.env.PORT}`);
});
