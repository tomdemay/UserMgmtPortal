import { HttpStatusCode } from "@angular/common/http";

/**
 * @description StatusInfo is a class that contains the status of an operation.
 * @property progress: number - The progress of the operation.
 * @property status: HttpStatusCode - The status of the operation.
 * @property messages: string[] - The messages of the operation.
 * @property timeStamp: Date - The time stamp of the operation.
 */
export interface StatusInfo {
  progress?: number;
  status: HttpStatusCode;
  messages: string[];
  timeStamp: Date;
}
