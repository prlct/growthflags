export type SequenceEmail = {
  _id: string,
  name: string,
  applicationId: string,

  delayDays: number,
  sequenceId: string,
  subject: string,
  body: string,
  enabled: boolean,
  sent: number,
  unsubscribed: number,
  converted: number,
  index: number,
  allowRedirect: boolean,
  clicked: number,

  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
};
