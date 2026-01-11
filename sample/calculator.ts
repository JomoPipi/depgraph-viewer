import { add, multiply } from "./ok/utils";

export class Calculator {
  public addNumbers(a: number, b: number): number {
    return add(a, b);
  }

  public multiplyNumbers(a: number, b: number): number {
    return multiply(a, b);
  }

  public calculateArea(radius: number): number {
    return multiply(Math.PI, multiply(radius, radius));
  }
}
