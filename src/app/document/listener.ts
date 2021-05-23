/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import eventEmitter from "../../lib/utils/event";

export default (() => {
  eventEmitter.on('document_created', (result) => {
    console.log('Document created with id' + result.insertedId);
  });
})();
