import { expect, test, describe } from "@jest/globals";

import { Time, TimeString, TimeStringValidator } from "../src/time";

function* allTime(): Iterable<[hour: number, min: number]> {
  for (let hour = 0; hour < 23; ++hour) for (let min = 0; min < 60; ++min) yield [hour, min];
  yield [24, 0];
}

describe("TimeStringValidator", () => {
  test("Empty string", () => {
    expect(TimeStringValidator.test("")).toBe(false);
  });

  test("Max 59 minute", () => {
    expect(TimeStringValidator.test("00:60")).toBe(false);
  });

  test("Max 24:00", () => {
    expect(TimeStringValidator.test("24:00")).toBe(true);
    expect(TimeStringValidator.test("25:00")).toBe(false);
    expect(TimeStringValidator.test("24:01")).toBe(false);
    expect(TimeStringValidator.test("24:10")).toBe(false);
    expect(TimeStringValidator.test("24:59")).toBe(false);
    expect(TimeStringValidator.test("30:00")).toBe(false);
  });

  test("Only 2 digit numbers", () => {
    expect(TimeStringValidator.test("00:00")).toBe(true);

    expect(TimeStringValidator.test("0:00")).toBe(false);
    expect(TimeStringValidator.test(":00")).toBe(false);
    expect(TimeStringValidator.test("00:0")).toBe(false);
    expect(TimeStringValidator.test("00:")).toBe(false);
    expect(TimeStringValidator.test("0:0")).toBe(false);
    expect(TimeStringValidator.test(":0")).toBe(false);
    expect(TimeStringValidator.test("0:")).toBe(false);
    expect(TimeStringValidator.test(":")).toBe(false);
    expect(TimeStringValidator.test("000:000")).toBe(false);
  });

  test("Separator", () => {
    expect(TimeStringValidator.test("00:00")).toBe(true);
    expect(TimeStringValidator.test("00::00")).toBe(false);
    expect(TimeStringValidator.test("00 00")).toBe(false);
    expect(TimeStringValidator.test("00_00")).toBe(false);
  });

  test("No negative", () => {
    expect(TimeStringValidator.test("-00:-00")).toBe(false);
    expect(TimeStringValidator.test("-0:-00")).toBe(false);
    expect(TimeStringValidator.test("-00:-0")).toBe(false);
    expect(TimeStringValidator.test("-0:-0")).toBe(false);
  });
});

describe("Time", () => {
  describe("Constructing", () => {
    test("Minute overflow", () => {
      const t = new Time(0, 60);
      const t2 = new Time(0, 130);

      expect(t.hour).toBe(1);
      expect(t.min).toBe(0);

      expect(t2.hour).toBe(2);
      expect(t2.min).toBe(10);
    });
  });

  describe("Parsing", () => {
    test("Parse empty string", () => {
      expect(Time.parse("" as TimeString)).toBe(Time.MIN);
    });

    test("Parse all valid strings", () => {
      for (const [hour, min] of allTime()) {
        const h = hour < 10 ? `0${hour}` : hour;
        const m = min < 10 ? `0${min}` : min;
        const time = Time.parse(`${h}:${m}` as TimeString);

        expect(time.hour).toBe(hour);
        expect(time.min).toBe(min);
      }
    });

    test("Throws on invalid strings", () => {
      expect(() => Time.parse("01" as TimeString)).toThrow();
      expect(() => Time.parse("-10:00" as TimeString)).toThrow();
      expect(() => Time.parse("00:60" as TimeString)).toThrow();
    });
  });

  describe("Stringify", () => {
    test("Generates valid timeStrings", () => {
      for (const [hour, min] of allTime()) {
        const time = new Time(hour, min);
        expect(time.toString()).toMatch(TimeStringValidator);
      }
    });
  });

  describe("Compering", () => {
    describe("equals", () => {
      //TODO
    });

    describe("isBefore", () => {
      test("equal", () => {
        const t1 = new Time(12, 21);
        const t2 = new Time(12, 21);

        expect(t1.isBefore(t2)).toBe(false);
        expect(t2.isBefore(t1)).toBe(false);
        expect(t1.isBefore(t1)).toBe(false);
        expect(t2.isBefore(t2)).toBe(false);
      });

      test("minute", () => {
        const t1 = new Time(0, 21);
        const t2 = new Time(0, 20);
        expect(t1.isBefore(t2)).toBe(false);
        expect(t2.isBefore(t1)).toBe(true);
      });

      test("hour", () => {
        const t1 = new Time(21, 0);
        const t2 = new Time(20, 0);

        expect(t1.isBefore(t2)).toBe(false);
        expect(t2.isBefore(t1)).toBe(true);
      });
    });
  });
});
