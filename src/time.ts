export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Hour = `0${Digit}` | `1${Digit}` | "20" | "21" | "22" | "23";
export type Minute = `0${Digit}` | `1${Digit}` | `2${Digit}` | `3${Digit}` | `4${Digit}` | `5${Digit}`;
export type TimeString = `${Hour}:${Minute}` | "24:00";

export const TimeStringValidator = /^((0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]))|(24:00)$/;

export class Time {
  public static readonly MIN = new Time(0, 0);
  public static readonly MAX = new Time(24, 0);
  public static readonly MIDNIGHT = new Time(0, 0);
  public static readonly NOON = new Time(12, 0);
  public static readonly HOUR = new Time(1, 0);
  public static readonly MINUTE = new Time(0, 1);

  readonly hour: number;
  readonly min: number;

  constructor(hour: number, min: number) {
    this.min = min % 60;
    this.hour = hour + Math.floor(min / 60);
  }

  public get absoluteHour(): number {
    return this.hour + this.min / 60;
  }

  public get absoluteMinutes(): number {
    return this.hour * 60 + this.min;
  }

  public toString(): TimeString {
    return <TimeString>`${this.hour > 9 ? "" : "0"}${this.hour}:${this.min > 9 ? "" : "0"}${this.min}`;
  }

  public isBefore(other: Time): boolean {
    return Time.compare(this, other) < 0;
  }

  public isBeforeOrEqual(other: Time): boolean {
    return Time.compare(this, other) <= 0;
  }

  public isAfter(other: Time): boolean {
    return Time.compare(this, other) > 0;
  }

  public isAfterOrEqual(other: Time): boolean {
    return Time.compare(this, other) >= 0;
  }

  public add(other: Time): Time {
    return new Time(this.hour + other.hour, this.min + other.min);
  }

  public subtract(other: Time): Time {
    return new Time(this.hour - other.hour, this.min - other.min);
  }

  public floor(): Time {
    return new Time(this.hour, 0);
  }

  public ceil(): Time {
    return new Time(this.min > 0 ? this.hour + 1 : this.hour, 0);
  }

  public compare(other: Time): number {
    return Time.compare(this, other);
  }

  public static compare(time1: Time, time2: Time): -1 | 0 | 1 {
    return <1 | 0 | -1>Math.sign(time1.absoluteMinutes - time2.absoluteMinutes);
  }

  public static equals(time1: Time, time2: Time): boolean {
    return Time.compare(time1, time2) === 0;
  }

  public static *range(start: Time, end: Time, step = Time.HOUR): Iterable<Time> {
    let x = start;
    while (Time.compare(x, end) <= 0) {
      yield x;
      x = x.add(step);
    }
  }

  public static fromAbsoluteHour(value: number): Time {
    const hour = Math.trunc(value);
    const min = Math.round((value - hour) * 60);
    return new Time(hour, min);
  }

  public static fromAbsoluteMinute(value: number): Time {
    return new Time(0, value);
  }

  public static parse(timeString: TimeString): Time {
    if (!timeString) {
      return Time.MIN;
    }
    if (!TimeStringValidator.test(timeString)) {
      throw new Error("Parse failed, invalid time format!");
    }

    const [h, m] = timeString.split(":").map(x => parseInt(x));
    return new Time(h, m);
  }

  public static now(): Time {
    const date = new Date();
    return new Time(date.getHours(), date.getMinutes());
  }
}
