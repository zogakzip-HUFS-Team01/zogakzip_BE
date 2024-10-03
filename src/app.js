import 'dotenv/config';
import express from 'express';

import groupController from './controllers/groupController.js';
import groupPostsController from './controllers/groupPostsController.js';
import postActionsController from './controllers/postActionsController.js';
import postCommentsController from './controllers/postCommentsController.js';
import commentActionsController from './controllers/commentActionsController.js';
import multer from 'multer';
import cors from 'cors';

import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/groups', groupController);
app.use('/api/groups', groupPostsController);
app.use('/api/posts', postActionsController);
app.use('/api/posts', postCommentsController);
app.use('/api/comments', commentActionsController);

const upload = multer({ dest: 'image/' });

app.post('/api/image', upload.single('attachment'), (req, res) => {
    res.status(200).json({ message: req.file.path })
});

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
