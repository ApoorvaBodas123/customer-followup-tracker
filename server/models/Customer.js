import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return false;
          const cleanDigits = v.replace(/\D/g, '');
          const validPhonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
          return cleanDigits.length >= 10 && cleanDigits.length <= 15 && validPhonePattern.test(v);
        },
        message: (props) => `${props.value} is not a valid 10 to 15 digit phone number`,
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          if (!v || v.trim() === '') return true; // optional
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    followUpInterval: {
      type: Number,
      required: [true, 'Follow-up interval in days is required'],
      min: [1, 'Follow-up interval must be at least 1 day'],
      validate: {
        validator: Number.isInteger,
        message: 'Follow-up interval must be a whole number of days',
      },
    },
    lastContactedAt: {
      type: Date,
      required: [true, 'Last contacted date is required'],
      default: Date.now,
      validate: {
        validator: function (value) {
          if (!value) return true;
          // Allow up to 10 minutes in the future to account for minor clock drift
          const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
          return value <= tenMinutesFromNow;
        },
        message: 'Last contacted date cannot be in the future',
      },
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    contactHistory: [
      {
        contactedAt: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: 'Follow-up completed',
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Calculated Next Follow-up Date
// nextFollowUpDate = lastContactedAt + (followUpInterval * 24h)
customerSchema.virtual('nextFollowUpDate').get(function () {
  if (!this.lastContactedAt || !this.followUpInterval) return null;
  const lastContact = new Date(this.lastContactedAt).getTime();
  const intervalMs = this.followUpInterval * 24 * 60 * 60 * 1000;
  return new Date(lastContact + intervalMs);
});

// Virtual: Status ('due_today', 'overdue', 'upcoming')
customerSchema.virtual('followUpStatus').get(function () {
  const nextFollowUp = this.nextFollowUpDate;
  if (!nextFollowUp) return 'unknown';

  const now = new Date();
  
  // Normalize today's start and end boundaries in local time
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (nextFollowUp < startOfToday) {
    return 'overdue';
  } else if (nextFollowUp >= startOfToday && nextFollowUp <= endOfToday) {
    return 'due_today';
  } else {
    return 'upcoming';
  }
});

// Virtual: Days until next follow-up (negative if overdue, 0 if due today, positive if upcoming)
customerSchema.virtual('daysRemaining').get(function () {
  const nextFollowUp = this.nextFollowUpDate;
  if (!nextFollowUp) return 0;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const targetDate = new Date(nextFollowUp.getFullYear(), nextFollowUp.getMonth(), nextFollowUp.getDate(), 0, 0, 0, 0);

  const diffTime = targetDate.getTime() - startOfToday.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
});

export const Customer = mongoose.model('Customer', customerSchema);
