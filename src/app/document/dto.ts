/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
import Joi from "joi";

export default Joi.object({
  documentType: Joi.string().required(),
  details: Joi.string().trim().min(2).max(150).required(),
  personsConcerned: Joi.string().min(2).required(),
  remarks: Joi.any().optional()
});
