export type Subscription = {
  _id: string;
  subscriptionId: string,
  planId: string
  productId: string,
  customer: string,
  status: string,
  interval: string,
  startDate: Date,
  endDate: Date,
  cancelAtPeriodEnd: boolean,
  createdOn: Date,
  updatedOn: Date,
};
