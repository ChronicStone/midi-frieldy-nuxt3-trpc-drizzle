export function getFutureDate(offset: number, roundTo = 5) {
  const date = new Date();
  const minutes = date.getMinutes();
  const roundedMinutes = Math.ceil(minutes / roundTo) * roundTo;
  date.setMinutes(roundedMinutes + offset);
  return date;
}

export function getRawTimeDiff(deadline: string, start?: string, percent?: boolean) {
  const deadlineDate = new Date(deadline);
  const startDate = new Date(start ?? new Date());
  const currentDate = new Date();

  if (percent) {
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    const totalTime = deadlineDate.getTime() - startDate.getTime();
    const percentage = (timeDifference / totalTime) * 100;
    return percentage < 0 ? 0 : +percentage.toFixed(2);
  } else {
    const timeDifference = deadlineDate.getTime() - startDate.getTime();
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return (
      (hours < 10 ? '0' : '') +
      (hours < 0 ? '0' : hours) +
      ':' +
      (minutes < 10 ? '0' : '') +
      (minutes < 0 ? '0' : minutes) +
      ':' +
      (seconds < 10 ? '0' : '') +
      (seconds < 0 ? '0' : seconds)
    );
  }
}
