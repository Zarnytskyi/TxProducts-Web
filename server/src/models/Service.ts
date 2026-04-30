import { Schema, model, Document } from "mongoose";


export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  turnaround: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { 
      type: String, 
      required: true,
      trim: true,},
    price: { 
      type: Number, 
      required: true 
    },
    turnaround: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const Service = model<IService>("Service", serviceSchema);
export default Service;