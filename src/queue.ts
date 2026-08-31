import type { RatesResponse } from './requests';

type Callback = () => RatesResponse | void | undefined;

const queue = [];

export default async function queueStack(callback: Callback) {
  let isExecute = false;

  return {
    push: queue.push(callback),
    execute: async () => {
      while (queue.length > 0) {
        const request = queue.shift();
        const response = await request();
        return response;
      }
    },
  };
}
