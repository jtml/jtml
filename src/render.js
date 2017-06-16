import fragment from 'html-fragment';
import UTILS from './utils';
import HELPERS from './helpers';
import LOGGER from './logger';

const EVENT_ATTRIBUTE_NAME = 'jtml-event';
const JTML_EVENT_REGEX = /@(.*?)\((.*?)\)/g;

export default class Render {
	constructor(func) {
		this._func = func;
		this._html = '';
		this._fragment = null;
	}

	render(data, events) {
		this._html = this._func(data, UTILS, HELPERS);

		if (!events) {
			return this;
		}

		this._fragment = fragment(this._html);

		let eventElements = this._fragment.querySelectorAll(`[${EVENT_ATTRIBUTE_NAME}]`);

		for (let i = 0; i < eventElements.length; i++) {
			eventElements[i].getAttribute('jtml-event').replace(JTML_EVENT_REGEX, (...args) => {
				let eventType = args[1];
				let handlers = args[2].trim().split(/\s*,\s*/);

				for (let j = 0; j < handlers.length; j++) {
					eventElements[i].addEventListener(eventType, events[handlers[j]]);
				}
			});

			eventElements[i].removeAttribute(EVENT_ATTRIBUTE_NAME);
		}

		return this;
	}

	appendTo(selectorOrNode) {
		let element = UTILS.getElement(selectorOrNode);

		if (!element) {
			LOGGER.error(LOGGER.errors.invalidDomNodeOrSelector, selectorOrNode);
		}

		if (this._fragment && this._fragment.firstChild) {
			element.appendChild(this._fragment);
		}
		else {
			element.insertAdjacentHTML('beforeend', this._html);
		}

		return this;
	}

	html(selectorOrNode) {
		let element = UTILS.getElement(selectorOrNode);

		if (!element) {
			LOGGER.error(LOGGER.errors.invalidDomNodeOrSelector, selectorOrNode);
		}

		element.innerHTML = this._html;

		return this;
	}
}
