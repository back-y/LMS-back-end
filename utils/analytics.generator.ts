import { Document, Model, FilterQuery, QueryTypeCasting } from "mongoose";

// Define an interface for the schema with createdAt field
interface Timestamped {
  createdAt: Date;
}

interface MonthData {
  month: string;
  count: number;
}
export async function generateLast12MothsData<T extends Timestamped & Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );

    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    //THIS IS THE ORIGINAL AND OLd VERSION

    // const count = await model.countDocuments({
    //   createdAt: {
    //     $gte: startDate,
    //     $lt: endDate,
    //   },
    // });

    //IT IS WORK || FIRST OPTION
    // Construct the query object conditionally
    const query: FilterQuery<T> = {};

    if ("createdAt" in model.schema.obj) {
      query.createdAt = {
        $gte: startDate,
        $lt: endDate,
      } as QueryTypeCasting<T["createdAt"]>;
    }

    const count = await model.countDocuments(query);

    // THIS IS WORK || SECOND OPTION

    // Construct the query object conditionally
    // const query: FilterQuery<T> = {};
    // if ("createdAt" in model.schema.obj) {
    //   query["createdAt"] = { $gte: startDate, $lt: endDate } as any; // Ignore TypeScript for this specific part
    // }

    // const count = await model.countDocuments(query);

    last12Months.push({ month: monthYear, count });
  }
  return { last12Months };
}
