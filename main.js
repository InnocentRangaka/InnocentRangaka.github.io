/**
 * Imports the main CSS file for the application.
 * Imports the project details module, which likely contains information about the current project.
 */
import "./style.css";
import projectDetails from "./project-details.js";

// Nav Links
/**
 * Retrieves references to various DOM elements used in the application's navigation.
 *
 * @type {HTMLCollectionOf<HTMLElement>}
 * @property {HTMLCollectionOf<HTMLElement>} navLinks - The collection of navigation links.
 * @property {HTMLCollectionOf<HTMLElement>} navBtn - The collection of navigation buttons.
 * @property {HTMLCollectionOf<HTMLElement>} logoLink - The collection of logo links.
 */
const navElements = {
  navLinks: document.getElementsByClassName("nav__item"),
  navBtn: document.getElementsByClassName("header__btn"),
  logoLink: document.getElementsByClassName("logo__link"),
};
/**
 * Retrieves references to various DOM elements on the page, including the navigation links, header button, and logo link.
 */
const navLinks = document.getElementsByClassName("nav__item"),
  navBtn = document.getElementsByClassName("header__btn"),
  logoLink = document.getElementsByClassName("logo__link"),
  btnLink = document.getElementsByClassName("btn__link");

/**
 * Adds click event listeners to navigation links, buttons, and the logo link.
 * When a navigation link is clicked, it removes the "active" class from any
 * previously active link and adds the "active" class to the clicked link.
 * It then scrolls the page to the corresponding section using smooth scrolling.
 */
[...navLinks, ...navBtn, ...logoLink, ...btnLink].map((navLink) => {
  navLink.addEventListener("click", (event) => {
    event.preventDefault();

    if (!event.target.classList.contains("header__btn")) {
      const navList =
        event.target.parentElement.parentElement.classList.contains("active")
          ? event.target.parentElement.parentElement
          : document.querySelector(".nav__list");

      if (navList.querySelector(".active"))
        navList.querySelector(".active").classList.remove("active");
      event.target.classList.add("active");
    }

    const getHref =
        event.target.href || 
        event.target.parentElement.href || 
        window.location.origin + event.target.dataset.href,
      getHash = new URL(getHref).hash,
      SectionID = getHash.trim("").replace("/", "");

    let scrollToSection;

    if (!SectionID) {
      // scrollToSection = 0;
    } else {
      const element = document.querySelector("section" + SectionID);
      scrollToSection = element.offsetTop;
    }

    // Smooth scroll to the element's position
    window.scrollTo({
      top: scrollToSection,
      behavior: "smooth",
    });
  });
});

// About Tabs and Tabs Content
/**
 * Adds click event listeners to the about tabs, allowing the user to switch between different content sections.
 * When a tab is clicked, the following happens:
 * - The currently selected tab has its 'selected' class removed
 * - The clicked tab has the 'selected' class added to it
 * - The currently visible content section has its 'show' class removed
 * - The content section corresponding to the clicked tab has the 'show' class added to it
 */
const aboutTabs = () => {

  const aboutTabs = document.querySelectorAll(".about__tab");

  /**
   * Adds click event listeners to all tabs in the "about" section of the page.
   * When a tab is clicked, it removes the "selected" class from the previously selected tab
   * and adds the "selected" class to the clicked tab. It then shows the corresponding
   * tab content and hides any previously visible tab content.
   */
  [...aboutTabs].map((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      if (event.target.classList.contains("selected")) {
        return;
      }

      event.target.parentElement
        .querySelector(".selected")
        .classList.remove("selected");

      event.target.classList.add("selected");

      const tabsContent = document.querySelector(".about__tabs-content"),
        visibleTabContent = tabsContent.querySelector(".show");

      if (visibleTabContent) visibleTabContent.classList.remove("show");

      const contentID = "#" + event.target.id + "-content",
        tabContent = tabsContent.querySelector(contentID);

      if (tabContent) tabContent.classList.add("show");
    });
  });
};

/**
 * Checks if the ".about__tab" element exists on the page and calls the `aboutTabs()` function if it does.
 */
if (document.querySelector(".about__tab")) aboutTabs();

/**
 * Adds an event listener to the window that listens for scroll events. When a scroll event occurs, it queries all `section` elements on the page and calls the `isInViewport` function for each one.
 */
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  Object.values(sections).map((section) => {
    isInViewport(section);
  });
});

/**
 * Checks if an element is currently in the viewport.
 *
 * @param {HTMLElement} element - The element to check if it's in the viewport.
 * @returns {void}
 */
function isInViewport(element) {
  const headerHeight =
    document.querySelector("header").getBoundingClientRect().height || 0;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const rect = element.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const windowTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowBottom = windowTop + windowHeight;
      const elementTop = rect.top + windowTop;
      const elementBottom = rect.bottom + rect.height;

      const hashHeaderLink =
        document.querySelector(`a[href="/#${entry.target.id}"].nav__link`) ||
        document.querySelector(`a[href="./#${entry.target.id}"].nav__link`);
      const noHashHeaderLink =
        document.querySelector(`a[href="/${element.id}"].nav__link`) ||
        document.querySelector(`a[href="./${element.id}"].nav__link`);
      const headerLink = hashHeaderLink || noHashHeaderLink;

      if (entry.isIntersecting) {
        const inView = rect.top.toFixed(0) <= 0 && rect.bottom.toFixed(0) > 0;
        const topInView =
          windowTop.toFixed(0) >= elementTop.toFixed(0) &&
          rect.bottom.toFixed(0) >= rect.height.toFixed(0);
        const notView =
          windowTop.toFixed(0) >= elementTop.toFixed(0) &&
          rect.bottom.toFixed(0) <= 0;

        const isInView =
          (inView && topInView && !notView) || (inView && !notView);

        if (
          isInView &&
          headerLink &&
          !headerLink.classList.contains("active")
        ) {
          headerLink.classList.add("active");
        } else if (
          !isInView &&
          headerLink &&
          headerLink.classList.contains("active")
        ) {
          headerLink.classList.remove("active");
        }
      } else {
        if (headerLink && headerLink.classList.contains("active")) {
          headerLink.classList.remove("active");
        }
      }
    });
  });
  observer.observe(element);
}

const form = document.getElementById("contact-form");

/**
 * Handles the form submission event.
 *
 * This event listener is attached to the form element. When the form is submitted,
 * it prevents the default form submission behavior, collects the form data using
 * FormData, and then resets the form.
 */
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(form); // Collect form data

  form.reset(); // Clear form

  const button = form.querySelector("button");
  button.classList.add("success");
  button.textContent = "Message sent!";

  setTimeout(() => {
    button.classList.remove("success");
    button.textContent = "Send Me Message";
  }, 2000);
});


// Get the modal
const modal = document.getElementById("workPreviewModal");

// Get the button that opens the modal
const porfolioItems = document.getElementsByClassName("portfolio__item");

let scrollPosition = 0;

// When the user clicks on the button, open the modal
/**
 * Adds a click event listener to each portfolio item that opens a modal with the corresponding project details.
 * When a portfolio item is clicked:
 * - Prevents the default link behavior
 * - Calculates the index of the clicked item in the `projectDetails` array
 * - Stores the current scroll position
 * - Calls the `renderModal` function with the corresponding project details
 * - Disables scrolling on the body element to prevent the page from scrolling while the modal is open
 */
[...porfolioItems].map((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    const getItemId = item.dataset.item - 1;

    scrollPosition = window.scrollY;

    renderModal(projectDetails[getItemId]);

    document.body.style.overflow = "hidden";
    document.body.addEventListener(
      "touchmove",
      (event) => event.preventDefault(),
      { passive: false }
    );
    document.body.addEventListener("wheel", (event) => event.preventDefault());
  });
});

// Function to create a modal
/**
 * Creates a modal element with project information.
 *
 * @param {Object} project - The project object containing information to display in the modal.
 * @param {string} project.image - The URL of the project image.
 * @param {string} project.name - The name of the project.
 * @param {string} project.description - The description of the project.
 * @param {string[]} project.technology - An array of technologies used in the project.
 * @param {string} project.link - The URL of the project.
 * @returns {HTMLDivElement} The created modal element.
 */
function createModal(project) {
  const modal = document.createElement("div");
  modal.id = "workPreviewModal";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <header>
          <div class="container">
            <nav class="nav">
              <div class="logo__side">
                <span class="back close">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                    <path d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
                <!-- <img src="./assets/images/my_face_62X62.jpg" alt="Innocent Rangaka's Logo" /> -->
                <!-- <span>Innocent Rangaka</span> -->
              </div>
              <div class="buttons">
                <a class="close modal-close" href="#contact" target="_self" rel="noopener">Contact Me</a>
              </div>
            </nav>
          </div>
        </header>
      </div>
      <div class="modal-body">
        <section class="top-0 p-0">
          <div class="container">
            <div class="columns-3">
              <picture class="span-2">
                <img src="${project.image}" alt="" />
              </picture>
              <div class="project-info">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-footer-details">
                  <p class="columns-2"><span>Technology</span> <span class="span-2-3">${project.technology.join(
                    ", "
                  )}</span></p>
                  <p class="columns-2"><span>My role</span> <span class="span-2-3">Developer/Student</span></p>
                  <p class="columns-2"><span>Link</span> <a class="span-2-3" href="${
                    project.link
                  }" target="_blank">View the Project</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="modal-footer"></div>
    </div>
  `;

  return modal;
}

// Function to close the modal
/**
 * Closes the work preview modal and restores the page's scroll position.
 *
 * This function is responsible for hiding the work preview modal, restoring the
 * page's scroll position, and removing any event listeners that were added to
 * prevent scrolling while the modal was open.
 *
 * @returns {boolean} Always returns `true` to indicate successful closure of the modal.
 */
function closeModal() {
  const modal = document.querySelector("#workPreviewModal");

  if (modal) {
    modal.style.display = "none";
    modal.style.overflow = "";

    document.body.removeChild(modal);
    document.body.removeEventListener(
      "touchmove",
      (event) => event.preventDefault(),
      { passive: false }
    );
    document.body.removeEventListener("wheel", (event) =>
      event.preventDefault()
    );
  }

  /**
   * Resets the body's style to its default state.
   *
   * Remove any custom styles that may have been applied
   * to the body element, effectively restoring it to its default appearance.
   */
  document.body.style = "";

  /**
   * Scrolls the page to the specified vertical position using smooth scrolling behavior.
   *
   * Smoothly scroll the page to a specific vertical position,
   * typically in response to a user interaction or navigation event.
   *
   * @param {number} scrollPosition - The vertical position (in pixels) to scroll to.
   * @returns {void}
   */
  window.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });

  return true;
}


// Function to render the modal
/**
 * Renders a modal with the provided project data.
 *
 * @param {Object} project - The project data to display in the modal.
 */
function renderModal(project) {
  const modal = createModal(project);

  document.body.appendChild(modal);
  modal.style.display = "block";
  modal.style.overflow = "auto";

  clickToCloseModal();
}


/**
 * Attaches click event listeners to the specified elements to close a modal.
 *
 * @param {HTMLElement[]} [elements] - An optional array of elements to attach the click event listener to. If not provided, the function will use all elements with the ".close" class within the "#workPreviewModal" element.
 * @returns {void}
 */
function clickToCloseModal(elements) {
  // Get the <span> element that closes the modal
  const modal = document.querySelector("#workPreviewModal");
  const spans = elements || modal.querySelectorAll(".close");

  Object.values(spans).map((span) => {
    span.addEventListener("click", (event) => {
      event.preventDefault();

      closeModal();

      if (span.classList.contains("modal-close")) {
        const getHash = new URL(event.target.href).hash,
          SectionID = getHash.trim("");

        const element = document.querySelector("section" + SectionID);
        if (element) {
          window.scrollTo({
            top: element.offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });
}



// When the user clicks anywhere outside of the modal, close it
/**
 * Closes the modal when the user clicks outside of it.
 * @param {MouseEvent} event - The click event object.
 */
window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
}



