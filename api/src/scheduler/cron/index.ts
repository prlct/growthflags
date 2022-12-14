import schedule from 'node-schedule';
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

schedule.scheduleJob('0 0 * * *', () => {
  eventEmitter.emit('cron:every-day');
});

export default eventEmitter;
