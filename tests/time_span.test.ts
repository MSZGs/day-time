import { expect, test, describe } from "@jest/globals";

import { Time } from "../src/time";
import { TimeSpan } from "../src/time-span";
import { timeSpan } from "../src/utils";

describe("TimeSpan", () => {
  describe("constructor", () => {
    test("time ascending", () => {
      const interval = new TimeSpan(new Time(10, 20), new Time(6, 22));
      expect(interval.start.hour).toBe(6);
      expect(interval.start.min).toBe(22);
      expect(interval.end.hour).toBe(10);
      expect(interval.end.min).toBe(20);
    });
  });

  describe("isIntersect", () => {
    const base = timeSpan`06:10-10:46`;
    const baseForMin = timeSpan`06:20-06:50`;
    const baseForHour = timeSpan`05:00-10:00`;

    test("after", () => {
      expect(base.isIntersect(timeSpan`11:20-12:00`)).toBe(false);
      expect(baseForMin.isIntersect(timeSpan`06:05-06:10`)).toBe(false);
      expect(baseForHour.isIntersect(timeSpan`02:00-04:00`)).toBe(false);
    });

    test("start touching", () => {
      expect(base.isIntersect(timeSpan`03:00-06:10`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:00-06:20`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`03:00-05:00`)).toBe(true);
    });

    test("start inside", () => {
      expect(base.isIntersect(timeSpan`04:00-10:48`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:00-06:25`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`04:00-06:00`)).toBe(true);
    });

    test("start touching, inside", () => {
      expect(base.isIntersect(timeSpan`06:10-10:48`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:20-06:55`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`05:00-12:00`)).toBe(true);
    });

    test("start touching, enclosing", () => {
      expect(base.isIntersect(timeSpan`06:10-10:45`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:20-06:40`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`05:00-09:00`)).toBe(true);
    });
    test("enclosing", () => {
      expect(base.isIntersect(timeSpan`06:20-10:45`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:20-06:40`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`06:00-09:00`)).toBe(true);
    });
    test("end touching, enclosing", () => {
      expect(base.isIntersect(timeSpan`06:20-10:46`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:20-06:50`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`06:00-10:00`)).toBe(true);
    });

    test("exact match", () => {
      expect(base.isIntersect(timeSpan`06:10-10:46`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:20-06:50`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`05:00-10:00`)).toBe(true);
    });
    test("inside", () => {
      expect(base.isIntersect(timeSpan`06:11-10:45`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:21-06:49`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`06:00-07:00`)).toBe(true);
    });
    test("end touching, inside", () => {
      expect(base.isIntersect(timeSpan`06:09-10:46`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:19-06:50`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`03:00-07:00`)).toBe(true);
    });
    test("end inside", () => {
      expect(base.isIntersect(timeSpan`10:40-18:46`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:40-06:58`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`09:00-18:00`)).toBe(true);
    });
    test("end touching", () => {
      expect(base.isIntersect(timeSpan`10:46-18:46`)).toBe(true);
      expect(baseForMin.isIntersect(timeSpan`06:50-06:58`)).toBe(true);
      expect(baseForHour.isIntersect(timeSpan`10:00-18:00`)).toBe(true);
    });
    test("before", () => {
      expect(base.isIntersect(timeSpan`10:50-18:46`)).toBe(false);
      expect(baseForMin.isIntersect(timeSpan`06:55-06:58`)).toBe(false);
      expect(baseForHour.isIntersect(timeSpan`11:00-18:00`)).toBe(false);
    });
  });

  describe("isOverlaps", () => {
    const base = timeSpan`06:10-10:46`;
    const baseForMin = timeSpan`06:20-06:50`;
    const baseForHour = timeSpan`05:00-10:00`;

    test("after", () => {
      expect(base.isOverlaps(timeSpan`11:20-12:00`)).toBe(false);
      expect(baseForMin.isOverlaps(timeSpan`06:05-06:10`)).toBe(false);
      expect(baseForHour.isOverlaps(timeSpan`02:00-04:00`)).toBe(false);
    });

    test("start touching", () => {
      expect(base.isOverlaps(timeSpan`03:00-06:10`)).toBe(false);
      expect(baseForMin.isOverlaps(timeSpan`06:00-06:20`)).toBe(false);
      expect(baseForHour.isOverlaps(timeSpan`03:00-05:00`)).toBe(false);
    });

    test("start inside", () => {
      expect(base.isOverlaps(timeSpan`04:00-10:48`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:00-06:25`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`04:00-06:00`)).toBe(true);
    });

    test("start touching, inside", () => {
      expect(base.isOverlaps(timeSpan`06:10-10:48`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:20-06:55`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`05:00-12:00`)).toBe(true);
    });

    test("start touching, enclosing", () => {
      expect(base.isOverlaps(timeSpan`06:10-10:45`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:20-06:40`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`05:00-09:00`)).toBe(true);
    });
    test("enclosing", () => {
      expect(base.isOverlaps(timeSpan`06:20-10:45`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:20-06:40`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`06:00-09:00`)).toBe(true);
    });
    test("end touching, enclosing", () => {
      expect(base.isOverlaps(timeSpan`06:20-10:46`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:20-06:50`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`06:00-10:00`)).toBe(true);
    });

    test("exact match", () => {
      expect(base.isOverlaps(timeSpan`06:10-10:46`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:20-06:50`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`05:00-10:00`)).toBe(true);
    });
    test("inside", () => {
      expect(base.isOverlaps(timeSpan`06:11-10:45`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:21-06:49`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`06:00-07:00`)).toBe(true);
    });
    test("end touching, inside", () => {
      expect(base.isOverlaps(timeSpan`06:09-10:46`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:19-06:50`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`03:00-07:00`)).toBe(true);
    });
    test("end inside", () => {
      expect(base.isOverlaps(timeSpan`10:40-18:46`)).toBe(true);
      expect(baseForMin.isOverlaps(timeSpan`06:40-06:58`)).toBe(true);
      expect(baseForHour.isOverlaps(timeSpan`09:00-18:00`)).toBe(true);
    });
    test("end touching", () => {
      expect(base.isOverlaps(timeSpan`10:46-18:46`)).toBe(false);
      expect(baseForMin.isOverlaps(timeSpan`06:50-06:58`)).toBe(false);
      expect(baseForHour.isOverlaps(timeSpan`10:00-18:00`)).toBe(false);
    });
    test("before", () => {
      expect(base.isOverlaps(timeSpan`10:50-18:46`)).toBe(false);
      expect(baseForMin.isOverlaps(timeSpan`06:55-06:58`)).toBe(false);
      expect(baseForHour.isOverlaps(timeSpan`11:00-18:00`)).toBe(false);
    });
  });

  describe("duration", () => {
    test("inMinutes", () => {
      const cases: [TimeSpan, number][] = [
        [timeSpan`06:00-07:00`, 60],
        [timeSpan`05:30-06:30`, 60],
        [timeSpan`00:00-24:00`, 1440],
      ];
      cases.forEach(x => expect(x[0].durationInMinutes).toBe(x[1]));
    });

    test("inHours", () => {
      const cases: [TimeSpan, number][] = [
        [timeSpan`06:00-07:00`, 1],
        [timeSpan`05:30-06:30`, 1],
        [timeSpan`00:00-24:00`, 24],
      ];
      cases.forEach(x => expect(x[0].durationInHours).toBe(x[1]));
    });
  });

  test("toString", () => {
    expect(timeSpan`06:00-07:00`.toString()).toMatch("06:00-07:00");
    expect(timeSpan`12:34-21:59`.toString()).toMatch("12:34-21:59");
  });
});
