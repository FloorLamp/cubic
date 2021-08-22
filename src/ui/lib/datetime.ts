import { DateTime, Duration } from "luxon";

export const dateTimeFromNanos = (n: bigint) =>
  DateTime.fromSeconds(Number(n / BigInt(1e9)));

export const dateTimeToNanos = (dt: DateTime) =>
  BigInt(dt.toSeconds()) * BigInt(1e9);

export const secondsToDuration = (n: number | bigint): Duration => {
  let seconds = n;
  if (typeof seconds === "bigint") {
    seconds = Number(n);
  }
  return Duration.fromObject({
    seconds,
  }).shiftTo("years", "months", "days", "hours", "minutes", "seconds");
};

const floorAndPad = (n: number) => Math.floor(n).toString().padStart(2, "0");

export const formatDuration = (d: Duration) => {
  return `${d.days > 0 ? `${d.days}d ` : ""}${floorAndPad(
    d.hours
  )}:${floorAndPad(d.minutes)}:${floorAndPad(d.seconds)}`;
};
