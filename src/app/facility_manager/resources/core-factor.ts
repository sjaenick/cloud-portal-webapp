import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';

/**
 * CoreFactor class.
 */
export class CoreFactor {

  private _id: string;
  private _factor: number;
  private _cores: number;
  private _compute_center: ComputecenterComponent;
  private _description: string;

  constructor(factor: number, cores: number, compute_center: ComputecenterComponent, description: string) {
    this._factor = factor;
    this._cores = cores;
    this._compute_center = compute_center;
    this._description = description;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get factor(): number {
    return this._factor;
  }

  set factor(value: number) {
    this._factor = value;
  }

  get cores(): number {
    return this._cores;
  }

  set cores(value: number) {
    this._cores = value;
  }

  get compute_center(): ComputecenterComponent {
    return this._compute_center;
  }

  set compute_center(value: ComputecenterComponent) {
    this._compute_center = value;
  }
}
