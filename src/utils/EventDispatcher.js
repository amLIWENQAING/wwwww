export class EventDispatcher {
    constructor() {
        this._eventHandlers = {};
    }

    addEventListener = (theEvent, theHandler) => {
        this._eventHandlers[theEvent] = this._eventHandlers[theEvent] || [];
        this._eventHandlers[theEvent].push(theHandler);
    };

    clearEventListener = (theEvent) => {
        //this._eventHandlers[theEvent].clear();
        this._eventHandlers[theEvent].length = 0
    };

    checkEventListener = (theEvent) => {
        return this._eventHandlers[theEvent].length > 0;
    };

    dispatchEvent = (theEvent, eventData, theHandler) => {
        theHandler(theEvent, eventData);
    };

    dispatchAll = (theEvent, eventData) => {
        var theHandlers = this._eventHandlers[theEvent];
        if (theHandlers) {
            for (var i = 0; i < theHandlers.length; i += 1) {
                this.dispatchEvent(theEvent, eventData, theHandlers[i]);
            }
        }
    };
}

export const GlobalEventer = {
    eventer: new EventDispatcher()
}