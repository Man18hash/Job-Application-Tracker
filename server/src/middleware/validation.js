import { body } from 'express-validator';

export const validateJob = [
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Position must be between 1 and 100 characters'),
  
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Company must be between 1 and 100 characters'),
  
  body('salary.amount')
    .trim()
    .notEmpty()
    .withMessage('Salary amount is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Salary amount must be between 1 and 50 characters'),
  
  body('salary.currency')
    .trim()
    .notEmpty()
    .withMessage('Salary currency is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters (e.g., USD)'),
  
  body('link')
    .trim()
    .notEmpty()
    .withMessage('Job link is required')
    .isURL()
    .withMessage('Job link must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(['applied', 'interviewing', 'offered', 'rejected', 'withdrawn', 'accepted'])
    .withMessage('Invalid status'),
  
  body('type')
    .optional()
    .isIn(['full_time', 'part_time', 'contract', 'intern', 'other'])
    .withMessage('Invalid job type'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
  
  body('source')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Source must be less than 100 characters'),
  
  body('contactEmail')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Allow empty values
      }
      return require('validator').isEmail(value);
    })
    .withMessage('Contact email must be valid'),
  
  body('contactName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Contact name must be less than 100 characters'),
  
  body('nextAction')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Next action must be less than 200 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  
  body('dateApplied')
    .optional()
    .isISO8601()
    .withMessage('Date applied must be a valid date'),
  
  body('deadline')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null/empty values
      }
      return require('validator').isISO8601(value);
    })
    .withMessage('Deadline must be a valid date'),
  
  body('followUpOn')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null/empty values
      }
      return require('validator').isISO8601(value);
    })
    .withMessage('Follow up date must be a valid date'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag must be less than 50 characters'),
  
  body('interviews')
    .optional()
    .isArray()
    .withMessage('Interviews must be an array'),
  
  body('interviews.*.type')
    .optional()
    .isIn(['phone', 'tech', 'onsite', 'hr', 'other'])
    .withMessage('Invalid interview type'),
  
  body('interviews.*.date')
    .optional()
    .isISO8601()
    .withMessage('Interview date must be valid'),
  
  body('offer.base')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Offer base must be less than 50 characters'),
  
  body('offer.bonus')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Offer bonus must be less than 50 characters'),
  
  body('offer.currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Offer currency must be 3 characters')
];

export const validateJobUpdate = [
  body('position')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Position cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Position must be between 1 and 100 characters'),
  
  body('company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Company must be between 1 and 100 characters'),
  
  body('salary.amount')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Salary amount cannot be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage('Salary amount must be between 1 and 50 characters'),
  
  body('salary.currency')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Salary currency cannot be empty')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters (e.g., USD)'),
  
  body('link')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job link cannot be empty')
    .isURL()
    .withMessage('Job link must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(['applied', 'interviewing', 'offered', 'rejected', 'withdrawn', 'accepted'])
    .withMessage('Invalid status'),
  
  body('type')
    .optional()
    .isIn(['full_time', 'part_time', 'contract', 'intern', 'other'])
    .withMessage('Invalid job type'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
  
  body('source')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Source must be less than 100 characters'),
  
  body('contactEmail')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Allow empty values
      }
      return require('validator').isEmail(value);
    })
    .withMessage('Contact email must be valid'),
  
  body('contactName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Contact name must be less than 100 characters'),
  
  body('nextAction')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Next action must be less than 200 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  
  body('dateApplied')
    .optional()
    .isISO8601()
    .withMessage('Date applied must be a valid date'),
  
  body('deadline')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null/empty values
      }
      return require('validator').isISO8601(value);
    })
    .withMessage('Deadline must be a valid date'),
  
  body('followUpOn')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null/empty values
      }
      return require('validator').isISO8601(value);
    })
    .withMessage('Follow up date must be a valid date'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag must be less than 50 characters'),
  
  body('interviews')
    .optional()
    .isArray()
    .withMessage('Interviews must be an array'),
  
  body('interviews.*.type')
    .optional()
    .isIn(['phone', 'tech', 'onsite', 'hr', 'other'])
    .withMessage('Invalid interview type'),
  
  body('interviews.*.date')
    .optional()
    .isISO8601()
    .withMessage('Interview date must be valid'),
  
  body('offer.base')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Offer base must be less than 50 characters'),
  
  body('offer.bonus')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Offer bonus must be less than 50 characters'),
  
  body('offer.currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Offer currency must be 3 characters')
];



