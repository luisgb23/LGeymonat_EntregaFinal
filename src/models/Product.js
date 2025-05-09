import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  thumbnails: {
    type: [String],
    default: []
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Middleware to handle thumbnails
productSchema.pre('save', function(next) {
  if (this.thumbnails && this.thumbnails.length > 0 && !this.thumbnail) {
    this.thumbnail = this.thumbnails[0];
  }
  next();
});

export default mongoose.model('Product', productSchema); 