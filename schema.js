const Joi = require("joi");

const listingJoiSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null),
  image: Joi.string().uri().allow("").default(
    "https://i.pinimg.com/1200x/f8/fa/fb/f8fafb163fbaf36515106730fe629f95.jpg"
  ),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  contry: Joi.string().required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
module.exports = { listingJoiSchema,reviewSchema }; 
