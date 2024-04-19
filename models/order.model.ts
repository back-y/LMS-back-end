import mongoose, { Document, Model, Schema } from "mongoose";


// Define the Timestamped interface || We add this interface only for admin to desply the analytics
interface Timestamped {
  createdAt: Date;
}
export interface IOrder extends Document, Timestamped {
  courseId: string;
  userId: string;
  payment_info: object;
}
const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      // required: true
    },
  },
  { timestamps: true }
);//,{timestamps: true} adding this at the end of orderSchema by separating  with comma, originally not work, so we are using the interface by creating the timestaps, and we putted createdAt MongoDB query, in this case it's working properlly!

const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);
export default OrderModel;
