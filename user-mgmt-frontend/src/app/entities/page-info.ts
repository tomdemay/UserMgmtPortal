/**
 * @description Interface for pagination information
 * @property size: number - The size of the page.
 * @property totalElements: number - The total number of elements.
 * @property totalPages: number - The total number of pages.
 * @property number: number - The current page number.
 */
export interface PageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
