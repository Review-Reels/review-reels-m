import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const getElapsedTime = (dateTime) => {
  return dayjs().to(dayjs(dateTime), true);
};
