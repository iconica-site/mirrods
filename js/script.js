/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 524:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: function() { return /* binding */ Slide; }
/* harmony export */ });
class Slide {
  static addingClass = "slide-active";

  /**
   * @description
   * Плавно раскрывает элемент.
   *
   * @param {Element} element - Элемент, который будет раскрываться.
   *
   * @param {number} duration - Время в миллисекундах, за которое элемент раскроется. По умолчанию 300.
   *
   * @returns {void}
   */
  static down(element, duration = 300) {
    const { classList: elementClassList } = element;

    if (!elementClassList.contains(this.addingClass)) {
      const { style: elementStyle } = element;

      elementClassList.add(this.addingClass);

      if (element.hidden) element.hidden = false;

      elementStyle.overflow = "hidden";
      elementStyle.height = 0;
      elementStyle.paddingTop = 0;
      elementStyle.paddingBottom = 0;
      elementStyle.marginTop = 0;
      elementStyle.marginBottom = 0;
      element.offsetHeight;
      elementStyle.transitionProperty = "height, margin, padding";
      elementStyle.transitionDuration = `${duration}ms`;
      elementStyle.height = `${element.scrollHeight}px`;
      elementStyle.removeProperty("padding-top");
      elementStyle.removeProperty("padding-bottom");
      elementStyle.removeProperty("margin-top");
      elementStyle.removeProperty("margin-bottom");

      setTimeout(() => {
        elementStyle.removeProperty("height");
        elementStyle.removeProperty("overflow");
        elementStyle.removeProperty("transition-duration");
        elementStyle.removeProperty("transition-property");
        elementClassList.remove(this.addingClass);
      }, duration);
    }
  }

  /**
   * @description
   * Плавно скрывает элемент.
   *
   * @param {Element} element - Элемент, который будет скрываться.
   *
   * @param {number} duration - Время в миллисекундах, за которое элемент скроется. По умолчанию 300.
   *
   * @returns {void}
   */
  static up(element, duration = 300) {
    const { classList: elementClassList } = element;

    if (!elementClassList.contains(this.addingClass)) {
      const { style: elementStyle, offsetHeight } = element;

      elementClassList.add(this.addingClass);
      elementStyle.transitionProperty = "height, margin, padding";
      elementStyle.transitionDuration = `${duration}ms`;
      elementStyle.height = `${offsetHeight}px`;
      element.offsetHeight;
      elementStyle.overflow = "hidden";
      elementStyle.height = 0;
      elementStyle.paddingTop = 0;
      elementStyle.paddingBottom = 0;
      elementStyle.marginTop = 0;
      elementStyle.marginBottom = 0;

      setTimeout(() => {
        element.hidden = true;
        elementStyle.removeProperty("height");
        elementStyle.removeProperty("padding-top");
        elementStyle.removeProperty("padding-bottom");
        elementStyle.removeProperty("margin-top");
        elementStyle.removeProperty("margin-bottom");
        elementStyle.removeProperty("overflow");
        elementStyle.removeProperty("transition-duration");
        elementStyle.removeProperty("transition-property");
        elementClassList.remove(this.addingClass);
      }, duration);
    }
  }

  /**
   * @description
   * Плавно раскрывает/скрывает элемент.
   *
   * @param {Element} element - Элемент, который будет раскрываться/скрываться.
   *
   * @param {number} duration - Время в миллисекундах, за которое элемент раскроется/скроется. По умолчанию 300.
   *
   * @returns {void}
   */
  static toggle(element, duration = 300) {
    element.hidden ? this.down(element, duration) : this.up(element, duration);
  }
}




/***/ }),

/***/ 635:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: function() { return /* binding */ Spoilers; }
/* harmony export */ });
/* harmony import */ var _slide_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(524);


const addingClass = "spoiler-active";
const keyCodes = ["ArrowDown", "ArrowUp", "Home", "End"];
const [down, up, home, end] = keyCodes;
const selectors = {
  button: "[data-spoiler=\"button\"]",
  region: "[data-spoiler=\"region\"]"
}

class Spoilers {
  #accordion;
  /** @type {SpoilerObject} */
  #activeSpoiler;
  #breakpoint;
  #breakpointType;
  /** @type {HTMLButtonElement[]} */
  #buttons = [];
  #firstButton;
  #id = `spoilerID-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
  #lastButton;
  #matchMedia;
  #onClick = this.#click.bind(this);
  #onKeydown = this.#keydown.bind(this);
  #parent;
  /** @type {boolean} */
  #slided;
  #slideDuration;
  /** @type {Element[]} */
  #spoilers;
  /** @type {SpoilerObject[]} */
  #spoilersArray = [];
  #spoilerSize;
  /** @type {WeakMap<HTMLButtonElement, SpoilerObject>} */
  #spoilersObject = new WeakMap();

  /** @type {SpoilersConstructor} */
  constructor(parent, options = {}) {
    if (parent instanceof Element) {
      this.#parent = parent;
      this.#spoilers = [...this.#parent.children];
    } else if (
      ["string", "undefined"].includes(typeof parent) ||
      parent instanceof NodeList ||
      parent instanceof HTMLCollection
    ) {
      const spoilersParents = ["string", "undefined"].includes(typeof parent) ?
        document.querySelectorAll(parent ?? "[data-spoilers]") : [...parent];
      const spoilersParentsLength = spoilersParents.length;

      if (spoilersParentsLength > 1) {
        const spoilersCollection = (new class Spoilers { });

        spoilersParents.forEach(($spoilerParent, index) => {
          spoilersCollection[index] = new Spoilers($spoilerParent, options);
        });

        return spoilersCollection;
      } else if (spoilersParentsLength === 1) {
        this.#parent = spoilersParents[0];
        this.#spoilers = [...this.#parent.children];
      }
    }

    if (this.#spoilers?.length) {
      const [
        {
          accordion: datasetAccordion,
          breakpoint: datasetBreakpoint,
          breakpointType: datasetBreakpointType,
          slideDuration: datasetSlideDuration
        },
        {
          accordion: optionsAccordion,
          breakpoint: optionsBreakpoint,
          breakpointType: optionsBreakpointType,
          slideDuration: optionsSlideDuration
        }
      ] = this.#checkOptionsValidity(this.#parent.dataset, options);

      this.#accordion = datasetAccordion ?? optionsAccordion ?? true;
      this.#breakpoint = datasetBreakpoint ?? optionsBreakpoint ?? false;

      if (this.#breakpoint) {
        this.#breakpointType = datasetBreakpointType ?? optionsBreakpointType ?? "max";
        this.#matchMedia = matchMedia(`(${this.#breakpointType}-width: ${this.#breakpoint}px)`);
      }

      this.#slideDuration = datasetSlideDuration ?? optionsSlideDuration ?? 300;

      this.#spoilers.forEach(($spoiler, index) => {
        /** @type {HTMLButtonElement} */
        const $button = $spoiler.querySelector(selectors.button);
        /** @type {HTMLDivElement} */
        const $region = $spoiler.querySelector(selectors.region);

        if ($button && $region) {
          const id = `${this.#id}-${index}`;
          const isActive = $spoiler.classList.contains(addingClass);

          let { slideDuration } = $spoiler.dataset;

          this.#buttons.push($button);
          $button.id = `${id}-button`;
          $region.id = `${id}-region`;
          slideDuration = !!slideDuration?.trim() && Number.isInteger(+slideDuration) ?
            +slideDuration : this.#slideDuration;

          /** @type {SpoilerObject} */
          const spoiler = { $button, $region, $spoiler, isActive, slideDuration }

          this.#spoilersObject.set($button, spoiler);
          this.#spoilersArray.push(spoiler);
        }
      });

      this.#spoilerSize = this.#spoilersArray.length;

      if (this.#spoilerSize) {
        this.#firstButton = this.#buttons[0];
        this.#lastButton = this.#buttons.at(-1);

        this.#init();
      }
    }
  }

  /** @type {SpoilerOptionsValidation} */
  #checkOptionsValidity(...options) {
    options = options.map(options => {
      let { accordion, breakpoint, breakpointType, slideDuration } = options;

      accordion = ["undefined", "boolean"].includes(typeof accordion) ? accordion :
        ["true", "false"].includes(accordion) ? eval(accordion) : undefined;
      breakpoint = typeof breakpoint === "undefined" || Number.isInteger(breakpoint) ? breakpoint :
        ["false", false].includes(breakpoint) ? false :
          typeof breakpoint === "string" && !!breakpoint.trim() && Number.isInteger(+breakpoint) ?
            +breakpoint : undefined;
      breakpointType = typeof breakpointType === "undefined" || ["min", "max"].includes(breakpointType) ?
        breakpointType : undefined;
      slideDuration = typeof slideDuration === "undefined" || Number.isInteger(slideDuration) ? slideDuration :
        typeof slideDuration === "string" && !!slideDuration.trim() && Number.isInteger(+slideDuration) ?
          +slideDuration : undefined;

      return { accordion, breakpoint, breakpointType, slideDuration };
    });

    return options;
  }

  #init() {
    if (this.#breakpoint) {
      this.#matchMedia.matches ? this.#activate() : this.#disableButtons();

      this.#matchMedia.addEventListener("change", event => {
        event.matches ? this.#activate() : this.#inactivate();
      });
    } else {
      this.#activate();
    }
  }

  #activate() {
    this.#spoilersArray.forEach(spoiler => {
      const { $button, $region, isActive } = spoiler;

      if ($button.hasAttribute("disabled")) this.#activateButtons($button);

      $button.setAttribute("aria-controls", $region.id);
      $button.ariaExpanded = isActive;
      $region.hidden = !isActive;
      $button.addEventListener("click", this.#onClick);
      $button.addEventListener("keydown", this.#onKeydown);

      if (this.#accordion || this.#spoilerSize < 7) {
        $region.setAttribute("role", "region");
        $region.setAttribute("aria-labeledby", $button.id);
      }

      if (this.#accordion && isActive) {
        if (this.#activeSpoiler) {
          const { $button, $region, $spoiler } = this.#activeSpoiler;

          this.#activeSpoiler.isActive = false;
          $button.ariaExpanded = false;
          $region.hidden = true;
          $spoiler.classList.remove(addingClass);
        }

        this.#activeSpoiler = spoiler;
      }
    });
  }

  #inactivate() {
    if (this.#activeSpoiler) this.#activeSpoiler = null;

    this.#spoilersArray.forEach(spoiler => {
      const { $button, $region } = spoiler;

      this.#disableButtons($button);
      $button.removeAttribute("aria-controls");
      $button.removeAttribute("aria-expanded");
      $region.hidden = false;
      $button.removeEventListener("click", this.#onClick);
      $button.removeEventListener("keydown", this.#onKeydown);

      if (this.#accordion || this.#spoilerSize < 7) {
        $region.removeAttribute("role");
        $region.removeAttribute("aria-labeledby");
      }
    });
  }

  /** @param {HTMLButtonElement} $button */
  #disableButtons($button) {
    if ($button) {
      $button.disabled = true;
    } else {
      this.#spoilersArray.forEach(spoiler => {
        spoiler.$button.disabled = true;
      });
    }
  }

  /** @param {HTMLButtonElement} $button */
  #activateButtons($button) {
    if ($button) {
      $button.disabled = false;
    } else {
      this.#spoilersArray.forEach(spoiler => {
        spoiler.$button.disabled = false;
      });
    }
  }

  /** @param {MouseEvent} event */
  #click(event) {
    const spoiler = this.#spoilersObject.get(event.currentTarget);
    const { $region, isActive, slideDuration } = spoiler;

    if (!$region.classList.contains(_slide_js__WEBPACK_IMPORTED_MODULE_0__/* .Slide */ .M.addingClass) && !this.#slided) {
      this.#slided = true;

      isActive ? this.#hide(spoiler) : this.#show(spoiler);

      setTimeout(() => {
        this.#slided = false;
      }, slideDuration);
    }
  }

  /** @param {KeyboardEvent} event */
  #keydown(event) {
    const { code } = event;

    if (keyCodes.includes(code)) {
      event.preventDefault();

      const { currentTarget } = event;

      if (
        (currentTarget === this.#firstButton && code === home) ||
        (currentTarget === this.#lastButton && code === end)
      ) return;

      if ([down, up].includes(code)) {
        const index = this.#buttons.indexOf(currentTarget);

        if (code === down) {
          currentTarget === this.#lastButton ? this.#firstButton.focus() :
            index === this.#spoilerSize - 2 ? this.#lastButton.focus() :
              this.#buttons[index + 1].focus();
        } else {
          currentTarget === this.#firstButton ? this.#lastButton.focus() :
            index === 1 ? this.#firstButton.focus() :
              this.#buttons[index - 1].focus();
        }
      } else {
        code === home ? this.#firstButton.focus() : this.#lastButton.focus();
      }
    }
  }

  /** @param {SpoilerObject} spoiler */
  #show(spoiler) {
    const { $button, $region, $spoiler, slideDuration } = spoiler;

    if (this.#accordion && this.#activeSpoiler) this.#hide(this.#activeSpoiler);

    this.#activeSpoiler = spoiler;
    spoiler.isActive = true;
    $button.ariaExpanded = true;
    $spoiler.classList.add(addingClass);
    _slide_js__WEBPACK_IMPORTED_MODULE_0__/* .Slide */ .M.down($region, slideDuration);
  }

  /** @param {SpoilerObject} spoiler */
  #hide(spoiler) {
    const { $button, $region, $spoiler, slideDuration } = spoiler;

    this.#activeSpoiler = null;
    spoiler.isActive = false;
    $button.ariaExpanded = false;
    $spoiler.classList.remove(addingClass);
    _slide_js__WEBPACK_IMPORTED_MODULE_0__/* .Slide */ .M.up($region, slideDuration);
  }
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {

;// CONCATENATED MODULE: ./src/js/modules/app.js
class App {
  /**
   * @description
   * Свойства и методы экземпляра класса `Burger`.
   *
   * @type {AppBurger}
   */
  static burger = {
    close: undefined,
    isActive: false,
    matchMedia: undefined
  }

  /**
   * @description
   * Свойства экземпляра класса `Dialogs`.
   *
   * @type {AppDialogs}
   */
  static dialogs = {
    activeDialogs: 0
  };

  /**
   * @description
   * Хранит элементы `html` и `body`.
   *
   * @type {AppDocument}
   */
  static document = {
    body: document.body,
    html: document.documentElement
  }

  /**
   * @description
   * Свойства экземпляра класса `HeaderObserver`.
   *
   * @type {AppHeaderObservers}
   */
  static headerObservers = {
    $header: document.querySelector("[data-header=\"header\"]")
  }

  /**
   * @description
   * Свойства элемента `html`.
   *
   * @type {AppHTML}
   */
  static html = {
    htmlClassList: this.document.html.classList,
    htmlStyle: this.document.html.style
  }
}



;// CONCATENATED MODULE: ./src/js/modules/header-observers.js


const { headerObservers: { $header }, html: { htmlClassList, htmlStyle } } = App;

class HeaderObservers {
  #$header = $header;
  /** @type {HTMLDivElement} */
  #$headerWrapper = document.querySelector("[data-header=\"wrapper\"]");
  #addingClass = "scrolled";
  #cssProperty = "--header-height";
  #intersection;
  #resize;

  /** @param {HeaderObserversOptions} options */
  constructor(options = {}) {
    this.#intersection = options.intersection ?? true;
    this.#resize = options.resize ?? true;

    this.#init();
  }

  #init() {
    if (this.#intersection && this.#$header) {
      const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          htmlClassList.toggle(this.#addingClass, !entry.isIntersecting);
        });
      });

      intersectionObserver.observe(this.#$header);
    }

    if (this.#resize && this.#$headerWrapper) {
      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { borderBoxSize: [{ blockSize }] } = entry;

          htmlStyle.setProperty(this.#cssProperty, `${blockSize}px`);
        });
      });

      resizeObserver.observe(this.#$headerWrapper);
    }
  }
}



;// CONCATENATED MODULE: ./src/js/scripts/scripts/header-observers.js


const headerObservers = new HeaderObservers();

;// CONCATENATED MODULE: ./src/js/modules/scrolling.js


const { html: { htmlClassList: scrolling_htmlClassList, htmlStyle: scrolling_htmlStyle }, document: { body } } = App;
const cssProperty = "--scrollbar-width";
const fixedElements = document.querySelectorAll("[data-fixed]");

fixedElements?.forEach(fixedElement => {
  fixedElement.style.paddingRight = `var(${cssProperty})`;
});

body.style.paddingRight = `var(${cssProperty})`;

class Scrolling {
  static #addingClass = "scroll-lock";

  /**
   * @description
   * Скрывает скроллбар.
   *
   * @returns {void}
   */
  static lock() {
    scrolling_htmlStyle.setProperty(`${cssProperty}`, `${this.#scrollbarWidth}px`);
    scrolling_htmlClassList.add(this.#addingClass);
  }

  /**
   * @description
   * Показывет скроллбар.
   *
   * @returns {void}
   */
  static unlock() {
    scrolling_htmlStyle.removeProperty(`${cssProperty}`);
    scrolling_htmlClassList.remove(this.#addingClass);
  }

  static get #scrollbarWidth() {
    return innerWidth - body.offsetWidth;
  }
}



;// CONCATENATED MODULE: ./src/js/modules/burger.js



const { burger: app, dialogs, document: { body: burger_body }, headerObservers: { $header: burger_$header }, html: { htmlClassList: burger_htmlClassList } } = App;
const selectors = {
  button: "[data-burger=\"button\"]",
  close: "[data-burger=\"close\"]",
  menu: "[data-burger=\"menu\"]",
  open: "[data-burger=\"open\"]",
  wrapper: "[data-burger=\"wrapper\"]",
  pageWrapper: "[data-wrapper]",
};
const { button: burger_button, close: burger_close, menu, open: burger_open, wrapper } = selectors;
/** @type {HTMLButtonElement} */
const $button = document.querySelector(burger_button);
const $menu = document.querySelector(menu);
const $placeholder = document.createElement("div");
const addingClass = "burger-active";
const buttons = !$button &&
  document.querySelector(burger_open) && document.querySelector(burger_close) ?
  {
    /** @type {HTMLButtonElement} */
    $close: document.querySelector(burger_close),
    /** @type {HTMLButtonElement} */
    $open: document.querySelector(burger_open)
  } : null;
const id = `burgerID-${Date.now().toString(36)}`;
const isButtonsSame = !!$button;
const menuLabel = $menu?.ariaLabel || $menu?.querySelector("nav")?.ariaLabel;

class Burger {
  #a11y;
  #breakpoint;
  #inertingElements;
  #matchMedia;
  #onClickOutside = this.#closeOnClickOutside.bind(this);
  #onClose = this.close.bind(this);
  #onEscape = this.#closeOnEscape.bind(this);
  #onOpen = this.open.bind(this);
  #onToggle = this.#toggle.bind(this);

  /** @param {BurgerOptions} options */
  constructor(options = {}) {
    if (($button || buttons) && $menu) {
      this.#breakpoint = options.breakpoint ?? 768;

      if (this.#breakpoint) {
        this.#matchMedia = matchMedia(`(max-width: ${this.#breakpoint}px)`);
      }

      this.#a11y = {
        buttonsLabels: {
          close: options.a11y?.buttonsLabels?.close ?? `Закрыть "${menuLabel || "бургер-меню"}"`,
          open: options.a11y?.buttonsLabels?.open ?? `Открыть "${menuLabel || "бургер-меню"}"`
        },
        inertElementsSelectors: options.a11y?.inertElementsSelectors ?? `${selectors.pageWrapper} > *:not(${selectors.wrapper})`,
        moveMenu: options.a11y?.moveMenu ?? false,
        wrapperSelector: options.a11y?.wrapperSelector ?? wrapper
      }
      this.#inertingElements = document.querySelectorAll(this.#a11y.inertElementsSelectors);

      this.#init();
    }
  }

  #init() {
    $menu.id = id;
    $placeholder.hidden = true;
    app.close = this.#onClose;
    app.matchMedia = this.#matchMedia;

    if (this.#breakpoint) {
      this.#matchMedia.matches ? this.#activate() : this.#hideButtons();

      this.#matchMedia.addEventListener("change", event => {
        const { matches } = event;

        if (matches) {
          this.#activate();
          this.#showButtons();
        } else {
          if (app.isActive) this.close(true);

          this.#inactivate();
          this.#hideButtons();
        }
      });
    } else {
      this.#activate();
    }
  }

  #activate() {
    if (isButtonsSame) {
      $button.ariaLabel = this.#a11y.buttonsLabels.open;
      $button.setAttribute("aria-controls", id);
      $button.ariaExpanded = false;
      $button.addEventListener("click", this.#onToggle);
    } else {
      buttons.$open.ariaLabel = this.#a11y.buttonsLabels.open;
      buttons.$open.setAttribute("aria-controls", id);
      buttons.$open.ariaExpanded = false;
      buttons.$open.addEventListener("click", this.#onOpen);
      buttons.$close.ariaLabel = this.#a11y.buttonsLabels.close;
      buttons.$close.addEventListener("click", this.#onClose);
    }

    if (this.#a11y.moveMenu) {
      $menu.insertAdjacentElement("afterend", $placeholder);

      burger_$header ? burger_$header.insertAdjacentElement("afterend", $menu) :
        burger_body.insertAdjacentElement("afterbegin", $menu);
    }
  }

  #inactivate() {
    if (isButtonsSame) {
      $button.removeAttribute("aria-label");
      $button.removeAttribute("aria-controls");
      $button.removeAttribute("aria-expanded");
      $button.removeEventListener("click", this.#onToggle);
    } else {
      buttons.$open.removeAttribute("aria-label");
      buttons.$open.removeAttribute("aria-controls");
      buttons.$open.removeAttribute("aria-expanded");
      buttons.$open.removeEventListener("click", this.#onOpen);
      buttons.$close.removeAttribute("aria-label");
      buttons.$close.removeEventListener("click", this.#onClose);
    }

    if (this.#a11y.moveMenu) {
      $placeholder.insertAdjacentElement("afterend", $menu);
      $placeholder.remove();
    }
  }

  #hideButtons() {
    if (isButtonsSame) {
      $button.hidden = true;
    } else {
      buttons.$open.hidden = true;
      buttons.$close.hidden = true;
    }
  }

  #showButtons() {
    if (isButtonsSame) {
      $button.hidden = false;
    } else {
      buttons.$open.hidden = false;
      buttons.$close.hidden = false;
    }
  }

  #toggle() {
    app.isActive ? this.close() : this.open();
  }

  /**
   * @description
   * Открывает бургер-меню.
   *
   * @returns {void}
   */
  open() {
    app.isActive = true;

    if (isButtonsSame) {
      $button.ariaLabel = this.#a11y.buttonsLabels.close;
      $button.ariaExpanded = true;
    } else {
      buttons.$open.ariaExpanded = true;
      buttons.$close.focus();
    }

    this.#inertingElements?.forEach(inertElement => {
      inertElement.setAttribute("inert", "");
    });

    document.addEventListener("keydown", this.#onEscape);
    document.addEventListener("click", this.#onClickOutside);
    Scrolling.lock();
    burger_htmlClassList.add(addingClass);
  }

  /**
   * @description
   * Закрывает бургер-меню.
   *
   * @param {boolean} force - Если `true`, бургер-меню закроется принудительно. По умолчанию `false`.
   *
   * @returns {void}
   */
  close(force = false) {
    if (force || !dialogs.activeDialogs) {
      app.isActive = false;

      if (isButtonsSame) {
        $button.ariaLabel = this.#a11y.buttonsLabels.open;
        $button.ariaExpanded = false;
        $button.focus();
      } else {
        buttons.$open.ariaExpanded = false;
        buttons.$open.focus();
      }

      this.#inertingElements?.forEach(inertElement => {
        inertElement.removeAttribute("inert");
      });

      document.removeEventListener("keydown", this.#onEscape);
      document.removeEventListener("click", this.#onClickOutside);

      if (!dialogs.activeDialogs) Scrolling.unlock();

      burger_htmlClassList.remove(addingClass);
    }
  }

  /** @param {KeyboardEvent} event */
  #closeOnEscape(event) {
    if (event.code === "Escape") this.close();
  }

  /** @param {MouseEvent} event */
  #closeOnClickOutside(event) {
    /** @type {{target: Element}} */
    const { target } = event;

    if (isButtonsSame) {
      if (!target.closest(this.#a11y.wrapperSelector) && !target.closest(burger_button) && !target.closest(menu)) this.close();
    } else {
      if (!target.closest(this.#a11y.wrapperSelector) && !target.closest(burger_open) && !target.closest(menu)) this.close();
    }
  }
}



;// CONCATENATED MODULE: ./src/js/scripts/scripts/burger.js


const burger = new Burger({
  breakpoint: 992,
});

;// CONCATENATED MODULE: ./src/js/scripts/scripts/up.js
/** @type {HTMLButtonElement} */
const upButton = document.querySelector(".up");

upButton?.addEventListener("click", () => {
  scrollTo({
    top: 0,
  });
});

;// CONCATENATED MODULE: ./src/js/modules/move.js
class Move {
  #$destination;
  #$elementAtIndex;
  #$placeholder = document.createElement("div");
  #$target;
  #breakpoint;
  #breakpointType;
  #destinationChildren;
  #index;
  #matchMedia;

  /** @param {MoveOptions} options */
  constructor(options) {
    this.#$destination = document.querySelector(options.destinationSelector);
    this.#$target = document.querySelector(options.targetSelector);

    if (this.#$destination && this.#$target) {
      this.#breakpoint = options.breakpoint ?? 768;
      this.#breakpointType = options.breakpointType ?? "max";
      this.#destinationChildren = this.#$destination.children;
      this.#index = options.index ?? "last";
      this.#matchMedia = matchMedia(`(${this.#breakpointType}-width: ${this.#breakpoint}px)`);

      if (this.#index !== "first" && this.#index !== "last") {
        this.#$elementAtIndex = this.#destinationChildren[this.#index];
      }

      this.#init();
    }
  }

  #init() {
    this.#$placeholder.hidden = true;

    if (this.#matchMedia.matches) this.#move();

    this.#matchMedia.addEventListener("change", event => {
      event.matches ? this.#move() : this.#remove();
    });
  }

  #move() {
    this.#$target.insertAdjacentElement("beforebegin", this.#$placeholder);

    if (this.#$elementAtIndex) {
      this.#$elementAtIndex.insertAdjacentElement("beforebegin", this.#$target);
    } else if (this.#index === "first") {
      this.#$destination.insertAdjacentElement("afterbegin", this.#$target);
    } else {
      this.#$destination.insertAdjacentElement("beforeend", this.#$target);
    }
  }

  #remove() {
    this.#$placeholder.insertAdjacentElement("beforebegin", this.#$target);
    this.#$placeholder.remove();
  }
}



;// CONCATENATED MODULE: ./src/js/scripts/scripts/move.js


const footerSocials = document.querySelector(".footer-socials");
const footerTopColumn = document.querySelector(".footer-top__column--top");

if (footerSocials && footerTopColumn) {
  const move = new Move({
    destinationSelector: ".footer-top__column--top",
    targetSelector: ".footer-socials",
  });
}

const footerInfo = document.querySelector(".footer-bottom__item--info");
const footerTopInner = document.querySelector(".footer-top__inner");

if (footerInfo && footerTopInner) {
  const move = new Move({
    destinationSelector: ".footer-top__inner",
    targetSelector: ".footer-bottom__item--info",
  });
}

const placingFormPaymentInfo = document.querySelector(".placing-payment__info");
const placingFormDelivery = document.querySelector(".placing-delivery");

if (placingFormPaymentInfo && placingFormDelivery) {
  const move = new Move({
    destinationSelector: ".placing-delivery",
    targetSelector: ".placing-payment__info",
    index: "first",
  });
}

const headerTopTel = document.querySelector(".header-top__tel");
const headerMainInner = document.querySelector(".header-main__inner");

if (headerTopTel && headerMainInner) {
  const move = new Move({
    destinationSelector: ".header-main__inner",
    targetSelector: ".header-top__tel",
    index: 1,
    breakpoint: 992,
  });
}

;// CONCATENATED MODULE: ./src/js/scripts/scripts/counter.js
/** @type {NodeListOf<HTMLDivElement} */
const counters = document.querySelectorAll(".counter");
const inputEvent = new Event("input");

counters?.forEach(counter => {
  /** @type {HTMLButtonElement} */
  const minusButton = counter.querySelector(".counter__button--minus");
  /** @type {HTMLButtonElement} */
  const plusButton = counter.querySelector(".counter__button--plus");
  const input = counter.querySelector("input");
  /** @type {HTMLLabelElement} */
  const label = counter.querySelector(".counter__label");

  if (minusButton && plusButton && input && label) {
    const { min, max } = input;

    minusButton.addEventListener("click", () => {
      changeInputValue("minus");
    });

    plusButton.addEventListener("click", () => {
      changeInputValue("plus");
    });

    input.addEventListener("input", () => {
      let { value } = input;

      value = +value;
      value = Math.trunc(value);

      if (value < min) value = min;
      if (value > max) value = max;

      input.value = value;
      label.innerText = input.value;
      label.classList.toggle("counter__label--wide", `${value}`.length > 1);
    });

    /** @param {"minus" | "plus"} action */
    function changeInputValue(action) {
      let { value } = input;

      value = +value;
      input.value = action === "minus" ? --value : ++value;
      input.dispatchEvent(inputEvent);
    }
  }
});

;// CONCATENATED MODULE: ./src/js/scripts/scripts/options.js
/** @type {HTMLFormElement} */
const optionsForm = document.querySelector(".options-form");

if (optionsForm) {
  /** @type {NodeListOf<HTMLInputElement>} */
  const inscriptionRadioInputs = optionsForm.querySelectorAll("input[data-inscription]");
  /** @type {HTMLDivElement} */
  const inscriptionExample = optionsForm.querySelector(".options-example");

  if (inscriptionRadioInputs.length && inscriptionExample) {
    inscriptionRadioInputs.forEach(inscriptionRadioInput => {
      inscriptionRadioInput.addEventListener("change", () => {
        /** @type {HTMLInputElement} */
        const checkedRadio = [...inscriptionRadioInputs].find(
          /** @param {HTMLInputElement} radio */
          radio => {
            return radio.checked;
          }
        );
        const { dataset } = checkedRadio;
        const { inscription } = dataset;

        inscriptionExample.toggleAttribute("disabled", inscription !== "with");
      });
    });
  }

  /** @type {HTMLButtonElement} */
  const optionsExampleButton = optionsForm.querySelector(".options-example__button");
  /** @type {HTMLDivElement} */
  const textExamples = optionsForm.querySelector(".example-texts");

  if (optionsExampleButton && textExamples) {
    optionsExampleButton.addEventListener("click", () => {
      textExamples.classList.add("show");
    });

    /** @type {NodeListOf<HTMLButtonElement | HTMLInputElement>} */
    const inscriptionButtons = textExamples.querySelectorAll(".example-texts__inscription");
    /** @type {HTMLDivElement} */
    const optionsExampleText = optionsForm.querySelector(".options-example__text");
    /** @type {HTMLInputElement} */
    const optionsExampleInput = optionsForm.querySelector("[data-example-input]");

    if (inscriptionButtons && optionsExampleText && optionsExampleInput) {
      /** @type {HTMLInputElement} */
      const inscriptionButtonInput = [...inscriptionButtons].find(
        /** @param {HTMLInputElement} inscriptionButton */
        inscriptionButton => {
          return inscriptionButton instanceof HTMLInputElement;
        }
      );
      const exampleSumbitButton = textExamples.querySelector(".example-texts__button");

      let exampleSumbitButtonDisableFunction;

      if (inscriptionButtonInput && exampleSumbitButton) {
        const { parentElement } = inscriptionButtonInput;

        exampleSumbitButtonDisableFunction = () => {
          const { value } = inscriptionButtonInput;
          const valueLength = value.length;

          exampleSumbitButton.toggleAttribute("disabled", !valueLength);
        }

        inscriptionButtonInput.addEventListener("input", () => {
          const { value } = inscriptionButtonInput;
          const { dataset } = parentElement;

          dataset.count = value.length;
        });

        inscriptionButtonInput.addEventListener("focus", exampleSumbitButtonDisableFunction);
      }

      textExamples.addEventListener("click", event => {
        /** @type {{target: HTMLElement}} */
        const { target } = event;

        if (target.closest(".example-texts__inscription")) {
          /** @type {HTMLButtonElement | HTMLInputElement} */
          const clickedButton = target.closest(".example-texts__inscription");

          inscriptionButtons?.forEach(button => {
            button.classList.toggle("example-texts__inscription--checked", clickedButton === button);
          });

          if (typeof exampleSumbitButtonDisableFunction === "function") {
            if (clickedButton instanceof HTMLInputElement) {
              clickedButton.addEventListener("input", exampleSumbitButtonDisableFunction);
            } else {
              inscriptionButtonInput.removeEventListener("input", exampleSumbitButtonDisableFunction);
              exampleSumbitButton.removeAttribute("disabled");
            }
          }
        }

        if (!target.closest(".example-texts__inner") || target.closest(".example-texts__close")) {
          textExamples.classList.remove("show");
        }

        if (target.closest(".example-texts__button:not(disabled)")) {
          /** @type {HTMLButtonElement | HTMLInputElement} */
          const checkedButton = [...inscriptionButtons].find(
            /** @param {HTMLButtonElement | HTMLInputElement} button */
            button => {
              return button.classList.contains("example-texts__inscription--checked");
            }
          );
          const innerText = checkedButton instanceof HTMLButtonElement ? checkedButton.innerText : checkedButton.value;

          optionsExampleText.innerText = innerText;
          optionsExampleInput.value = innerText;
          textExamples.classList.remove("show");
        }
      });

      document.addEventListener("keydown", event => {
        const { code } = event;

        if (code === "Escape") textExamples.classList.remove("show");
      });
    }
  }
}

// EXTERNAL MODULE: ./src/js/modules/spoilers.js
var spoilers = __webpack_require__(635);
;// CONCATENATED MODULE: ./src/js/scripts/scripts/spoilers.js


const spoilers_spoilers = new spoilers/* Spoilers */.r();

;// CONCATENATED MODULE: ./src/js/scripts/scripts/feedbacks.js
/** @type {HTMLInputElement} */
const feedbacksCheckbox = document.querySelector(".feedbacks-form__checkbox input");
/** @type {HTMLButtonElement} */
const feedbacksButton = document.querySelector(".feedbacks-form__button");

if (feedbacksCheckbox && feedbacksButton) {
  feedbacksCheckbox.addEventListener("change", () => {
    const { checked } = feedbacksCheckbox;

    feedbacksButton.toggleAttribute("disabled", !checked);
  });
}

;// CONCATENATED MODULE: ./src/js/scripts/scripts/product.js
/** @type {HTMLImageElement} */
const productMainImageBlock = document.querySelector(".product-images__image");
/** @type {NodeListOf<HTMLLIElement>} */
const productImages = document.querySelectorAll(".product-images__thumb");

if (productMainImageBlock && productImages.length) {
  const productMainImage = productMainImageBlock.querySelector("img");
  const productMainPicture = productMainImageBlock.querySelector("source");

  productImages.forEach(productImageBlock => {
    const productImage = productImageBlock.querySelector("img");
    const productPicture = productImageBlock.querySelector("source");

    if (productImage || productPicture) {
      const src = productImage?.src;
      const srcset = productPicture?.srcset;

      productImageBlock.addEventListener("click", () => {
        if (productMainImage && src) productMainImage.src = src;
        if (productMainPicture && srcset) productMainPicture.srcset = srcset;

        productImages.forEach(image => {
          image.classList.toggle("product-images__thumb--active", image === productImageBlock);
        });
      });
    }
  });
}

;// CONCATENATED MODULE: ./src/js/scripts/scripts.js










;// CONCATENATED MODULE: ./src/js/script.js


}();
/******/ })()
;