const uploadsBtn = document.getElementById("uploads-btn");
const settingsBtn = document.getElementById("settings-btn");
const layoutBtn = document.getElementById("layout-btn");

const uploadsTab = document.getElementById("uploads-tab");
const settingsTab = document.getElementById("settings-tab");
const layoutTab = document.getElementById("layout-tab");

const subsMenu = document.getElementById("subs-menu");
const hideBtn = document.getElementById("hide-subs-menu-btn");

const SubsMenu = {
  sections: {
    uploads: { btn: uploadsBtn, tab: uploadsTab },
    settings: { btn: settingsBtn, tab: settingsTab },
    layout: { btn: layoutBtn, tab: layoutTab },
  },

  activeSection: null,

  init() {
    for (let key of Object.keys(this.sections)) {
      const s = this.sections[key];
      if (s.btn.classList.contains("active")) this.activeSection = s;

      s.btn.addEventListener("click", () => {
        if (s.btn === this.activeSection?.btn) {
          return;
        }
        this.show();
        this.setActiveSection(s);
      });
    }

    hideBtn.addEventListener("click", () => {
      console.log("clicked");
      this.hide();
    });
  },

  setActiveSection(sec) {
    this.activeSection = sec;
    for (let key of Object.keys(this.sections)) {
      this.setSectionStatus(this.sections[key], false);
    }
    this.setSectionStatus(sec, true);
  },

  hide() {
    for (let key of Object.keys(this.sections)) {
      this.setSectionStatus(this.sections[key], false);
    }
    this.activeSection = null;
    subsMenu.style.display = "none";
  },
  show() {
    subsMenu.style.display = "grid";
  },

  setSectionStatus(section, isActive) {
    const action = isActive ? "add" : "remove";
    section.btn.classList[action]("active");
    section.tab.classList[action]("active");
  },
};

SubsMenu.init();

/*
 *
 * UPLOADS
 *
 */
const videoUpload = document.getElementById("video-upload-input");
const subsUpload = document.getElementById("subs-upload-input");
const Uploads = {
  init() {},

  addVideoUploadCallback(fn) {
    videoUpload.addEventListener("change", () => {
      const file = videoUpload.files[0];
      if (file) {
        fn(file);
      }
    });
  },

  addSubsUploadCallback(fn) {
    subsUpload.addEventListener("change", () => {
      const file = subsUpload.files[0];
      if (file) {
        fn(file);
      }
    });
  },
};
/*
 *
 * SETTINGS
 *
 */
const settingsForm = document.getElementById("subs-settings-form");
const desyncInput = document.getElementById("desync-input");
const Settings = {
  init() {
    settingsForm.addEventListener("submit", (e) => e.preventDefault());
  },
  addDesyncUpdate(fn) {
    desyncInput.addEventListener("input", (e) => {
      const valueNum = parseFloat(desyncInput.value);
      if (!Number.isNaN(valueNum)) fn(valueNum);
    });
  },
};

Settings.init();
