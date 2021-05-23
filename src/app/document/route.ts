/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {Router} from "express";
import {index, store, show, update, destroy} from "./handler";
import validateInput from "../../lib/middlewares/validator";
import documentSchema from "./dto";
import bindData from "../../lib/middlewares/bindData";

const router = Router();
const collection = 'documents';

router.get('/', index);
router.get('/:id', bindData(collection), show);
router.post('/', validateInput(documentSchema), store);
router.put('/:id', validateInput(documentSchema), bindData(collection), update);
router.delete('/:id', bindData(collection), destroy);

export default router;
