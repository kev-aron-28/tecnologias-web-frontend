export const stateManager = new EventTarget()
export type eventName = string;
export const openDrawer: eventName = 'open-drawer'

export interface OpenDrawerEventDetail {
  weatherId: string | null;
  munName: string | null;
}

class Events extends EventTarget {
  // Method to dispatch the custom event
  openDrawer(id: string | null, name: string | null): void {
    const customEvent = new CustomEvent<OpenDrawerEventDetail>(openDrawer, {
      detail: { weatherId: id, munName: name },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(customEvent);
  }
}

export const events = new Events()
