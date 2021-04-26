import { Time, TimeString } from "./time.js";

export const TimeSpanStringValidator = /^(((0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]))|(24:00))-(((0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]))|(24:00))$/;

export class TimeSpan {
  readonly start: Time;
  readonly end: Time;

  constructor(start: Time, end: Time) {
    if (start.isAfter(end)) {
      [start, end] = [end, start];
    }

    this.start = start;
    this.end = end;
  }

  public get durationInHours(): number {
    return this.end.subtract(this.start).absoluteHour;
  }

  public get durationInMinutes(): number {
    return this.end.subtract(this.start).absoluteMinutes;
  }

  public isIntersect(other: TimeSpan): boolean {
    return (
      Math.max(this.start.absoluteMinutes, other.start.absoluteMinutes) <=
      Math.min(this.end.absoluteMinutes, other.end.absoluteMinutes)
    );
  }

  public isOverlaps(other: TimeSpan): boolean {
    return (
      Math.max(this.start.absoluteMinutes, other.start.absoluteMinutes) <
      Math.min(this.end.absoluteMinutes, other.end.absoluteMinutes)
    );
  }

  public range(step = Time.HOUR): Iterable<Time> {
    return Time.range(this.start, this.end, step);
  }

  public toString(): string {
    return `${this.start.toString()}-${this.end.toString()}`;
  }

  public static parse(text: string): TimeSpan {
    if (!TimeSpanStringValidator.test(text)) {
      throw new Error("Parse failed, invalid timeSpan format!");
    }

    const [start, end] = <[TimeString, TimeString]>text.split("-");
    return new TimeSpan(Time.parse(start), Time.parse(end));
  }
}
