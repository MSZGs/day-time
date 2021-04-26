import { Time, TimeString } from "./time.js";
import { TimeSpan } from "./time-span.js";

export const TimeAttributeConverter = {
  fromAttribute: (value: TimeString): Time => Time.parse(value),
  toAttribute: (value: Time): TimeString => value.toString(),
};

export const TimeSpanAttributeConverter = {
  fromAttribute: (value: string): TimeSpan => TimeSpan.parse(value),
  toAttribute: (value: TimeSpan): string => value.toString(),
};

export function time(strings: TemplateStringsArray, ...values: unknown[]): Time {
  return Time.parse(String.raw(strings, values) as TimeString);
}

export function timeSpan(strings: TemplateStringsArray, ...values: unknown[]): TimeSpan {
  return TimeSpan.parse(String.raw(strings, values) as TimeString);
}
