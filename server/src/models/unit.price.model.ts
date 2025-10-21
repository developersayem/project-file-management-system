import mongoose, { Schema, Document } from "mongoose";

export interface IUnitPrice extends Document {
  unitprice:number
}

const UnitPriceSchema = new Schema<IUnitPrice>(
  {
    unitprice: { type: Number, required: true ,default:0 },
  },
  { timestamps: true }
);

export const UnitPrice= mongoose.model<IUnitPrice>("UnitPrice", UnitPriceSchema);
